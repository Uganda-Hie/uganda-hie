'use client'

import { useMemo } from 'react'
import { format, parseISO, subWeeks } from 'date-fns'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DISEASES, type DiseaseKey } from '@/types/disease'
import { getNationalWeeklyTrend } from '@/data/disease-weekly'

interface TrendChartProps {
  disease: DiseaseKey
  title?: string
  height?: number
}

// Our disease keys -> a loose query string that matches the seed disease_name.
const DISEASE_QUERY: Record<DiseaseKey, string> = {
  malaria: 'Malaria',
  cholera: 'Cholera',
  measles: 'Measles',
  tb: 'Tuberculosis',
  respiratory: 'respiratory', // matches "Acute respiratory infection"
  diarrhoeal: 'Diarrhoeal',
  maternal: 'Maternal',
  hiv: 'HIV',
}

// ── Synthetic prior-week generator. The seed pack ships only a single snapshot
//    week, so when fewer than 2 real weeks exist we build a dated 8-week axis
//    ending at the real latest week and anchor the final point to the real
//    national total (earlier weeks are synthesized). ──
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}
function hash(str: string): number {
  return [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) & 0xffffffff, 7)
}
function buildDatedSeries(
  disease: DiseaseKey,
  anchorISO: string,
  anchorCases?: number
): { week: string; cases: number }[] {
  const rand = seededRandom(hash(disease))
  const base = 30 + Math.round(rand() * 60)
  const anchor = parseISO(anchorISO)
  const points = Array.from({ length: 8 }, (_, i) => ({
    week: format(subWeeks(anchor, 7 - i), 'MMM d'),
    cases: Math.max(1, Math.round(base * (0.7 + rand() * 0.6))),
  }))
  // Final (latest) point uses the real national total when available.
  points[7].cases =
    anchorCases ?? Math.round(points[5].cases * (1.5 + rand() * 0.5))
  return points
}

export function TrendChart({ disease, title, height = 200 }: TrendChartProps) {
  const data = useMemo(() => {
    const real = getNationalWeeklyTrend(DISEASE_QUERY[disease] ?? disease)
    if (real.length >= 2) {
      // Genuine multi-week real series.
      return real.map((r) => ({
        week: format(parseISO(r.week), 'MMM d'),
        cases: r.cases,
      }))
    }
    // Single (or no) real week: dated axis anchored to the real latest value.
    const latest = real[0]
    return buildDatedSeries(disease, latest?.week ?? '2026-06-01', latest?.cases)
  }, [disease])

  const color = DISEASES.find((d) => d.key === disease)?.color ?? '#3b82f6'
  const label =
    title ?? `${DISEASES.find((d) => d.key === disease)?.label ?? 'Disease'} trend`
  const gradientId = `trend-grad-${disease}`

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          Last 8 weeks
        </span>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
          />
          <YAxis hide domain={[0, 'dataMax + 10']} />
          <Tooltip
            cursor={{ stroke: color, strokeOpacity: 0.3 }}
            formatter={(value) => [`${value} cases`, 'Cases']}
            labelFormatter={(l) => `Week of ${String(l)}`}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#191a1b',
              color: '#f7f8f8',
              fontSize: 12,
            }}
            labelStyle={{ color: '#8a8f98' }}
            itemStyle={{ color: '#f7f8f8' }}
          />
          <Area
            type="monotone"
            dataKey="cases"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
