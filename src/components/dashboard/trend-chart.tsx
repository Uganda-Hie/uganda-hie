'use client'

import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DISEASES, type DiseaseKey } from '@/types/disease'

interface TrendChartProps {
  disease: DiseaseKey
  title?: string
  height?: number
}

// Deterministic pseudo-random seeded by the disease name.
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

interface Point {
  week: string
  cases: number
}

function buildSeries(disease: DiseaseKey): Point[] {
  const rand = seededRandom(hash(disease))
  const base = 30 + Math.round(rand() * 60)

  const points: Point[] = Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`,
    cases: Math.max(1, Math.round(base * (0.7 + rand() * 0.6))),
  }))

  // W8 (current week) should always read as a clear upward spike vs W6.
  points[7].cases = Math.round(points[5].cases * (1.5 + rand() * 0.5))

  return points
}

export function TrendChart({ disease, title, height = 200 }: TrendChartProps) {
  const data = useMemo(() => buildSeries(disease), [disease])
  const color = DISEASES.find((d) => d.key === disease)?.color ?? '#3b82f6'
  const label = title ?? `${DISEASES.find((d) => d.key === disease)?.label ?? 'Disease'} trend`
  const gradientId = `trend-grad-${disease}`

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
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
            labelFormatter={(label) => `Week ${String(label).replace('W', '')}`}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 12,
            }}
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
