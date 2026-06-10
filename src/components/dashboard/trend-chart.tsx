'use client'

import { useMemo } from 'react'
import { format, parseISO, subWeeks } from 'date-fns'
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DISEASES, type DiseaseKey } from '@/types/disease'
import { getNationalWeeklyTrend } from '@/data/disease-weekly'
import { useDemoStore } from '@/store/demo-store'

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

// ── Disease-specific realistic 8-week patterns ──
// Each array is a per-week multiplier against an endemic baseline. The final
// (8th) point is anchored to the real latest-week national total from the seed
// data; prior weeks are scaled relative to that anchor. `surge` variants apply
// only when the matching outbreak scenario is active.
const PATTERNS: Record<
  DiseaseKey,
  { normal: number[]; surge?: number[] }
> = {
  // Seasonal — gentle wave rising toward recent weeks; surge jumps in last 3.
  malaria: {
    normal: [0.6, 0.7, 0.75, 0.8, 0.9, 1.0, 1.1, 1.0],
    surge: [0.6, 0.65, 0.7, 0.75, 0.85, 1.2, 1.8, 2.3],
  },
  // Cluster spike — very low flat line; surge erupts in last 2 weeks.
  cholera: {
    normal: [0.1, 0.1, 0.2, 0.1, 0.1, 0.2, 0.15, 0.1],
    surge: [0.1, 0.1, 0.1, 0.1, 0.2, 0.8, 2.1, 1.8],
  },
  // Rare — always low with an occasional case report.
  measles: { normal: [0.3, 0.1, 0.4, 0.2, 0.1, 0.3, 0.5, 0.2] },
  // Stable — flat with minor variation.
  tb: { normal: [0.9, 0.95, 0.92, 0.98, 0.96, 0.99, 0.97, 1.0] },
  // Seasonal peaks — higher variation, tracks weather.
  respiratory: { normal: [0.8, 0.9, 1.1, 1.0, 0.85, 0.9, 1.05, 1.0] },
  // Slow downward trend — ART programme effect (good-news story).
  hiv: { normal: [1.1, 1.05, 1.0, 0.98, 0.95, 0.92, 0.9, 0.88] },
  // Very low flat line — concerning only when spiked.
  maternal: { normal: [0.5, 0.3, 0.6, 0.4, 0.3, 0.5, 0.4, 0.3] },
  // Moderate seasonal variation.
  diarrhoeal: { normal: [0.8, 0.85, 0.9, 1.0, 1.1, 1.0, 0.95, 1.0] },
}

function buildSeries(
  disease: DiseaseKey,
  anchorISO: string,
  anchorCases: number,
  surge: boolean
): { series: { week: string; cases: number }[]; baseline: number } {
  const pat = PATTERNS[disease] ?? PATTERNS.malaria
  const mult = (surge && pat.surge ? pat.surge : pat.normal).slice(0, 8)
  const anchorDate = parseISO(anchorISO)
  const anchor = Math.max(1, anchorCases)

  // Week 8 multiplier maps to the real anchor value, so baseline (1.0×) is
  // anchor / lastMultiplier, and every earlier week scales from there.
  const last = mult[7] || 1
  const unit = anchor / last
  const baseline = Math.round(unit)

  const series = mult.map((m, i) => ({
    week: format(subWeeks(anchorDate, 7 - i), 'MMM d'),
    cases: i === 7 ? anchor : Math.max(0, Math.round(unit * m)),
  }))

  return { series, baseline }
}

export function TrendChart({ disease, title, height = 200 }: TrendChartProps) {
  const scenario = useDemoStore((s) => s.scenario)

  const { data, baseline } = useMemo(() => {
    const real = getNationalWeeklyTrend(DISEASE_QUERY[disease] ?? disease)
    const latest = real[real.length - 1]
    const anchorISO = latest?.week ?? '2026-06-01'
    const anchorCases = latest?.cases ?? 40

    const surge =
      (disease === 'malaria' && scenario === 'malaria-surge') ||
      (disease === 'cholera' && scenario === 'cholera-alert')

    const { series, baseline } = buildSeries(disease, anchorISO, anchorCases, surge)
    return { data: series, baseline }
  }, [disease, scenario])

  const color = DISEASES.find((d) => d.key === disease)?.color ?? '#3b82f6'
  const label =
    title ?? `${DISEASES.find((d) => d.key === disease)?.label ?? 'Disease'} trend`
  const gradientId = `trend-grad-${disease}`

  // Only draw the baseline guide when it sits within the visible value range
  // (avoids an off-canvas line for very-low-incidence diseases).
  const maxCases = Math.max(...data.map((d) => d.cases))
  const showBaseline = baseline > 0 && baseline <= maxCases * 1.1

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
          {showBaseline && (
            <ReferenceLine
              y={baseline}
              stroke="#62666d"
              strokeDasharray="4 4"
              strokeOpacity={0.7}
              label={{
                value: 'Baseline',
                position: 'insideTopLeft',
                fill: '#62666d',
                fontSize: 10,
              }}
            />
          )}
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
