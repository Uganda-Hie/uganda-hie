'use client'

import { useMemo, useState } from 'react'
import { format, parseISO, subDays } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Cell,
} from 'recharts'
import { Clock, CheckSquare, AlertTriangle } from 'lucide-react'
import { FACILITIES } from '@/data/facilities'
import { DISTRICTS } from '@/data/districts'
import { getNationalMonthlyKPIs } from '@/data/district-monthly'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DEMO_TODAY = '2026-06-08'

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}
const charSum = (str: string) =>
  [...str].reduce((sum, c) => sum + c.charCodeAt(0), 0)

interface Quality {
  id: string
  name: string
  level: string
  districtName: string
  hasReportedToday: boolean
  reportingStreak: number
  lateSubmissions: number
  zeroReportFlags: number
  completenessScore: number
  daysSinceLastReport: number
  lastReportDate: string
}

function buildQuality(): Quality[] {
  const districtById = new Map(DISTRICTS.map((d) => [d.id, d]))
  return FACILITIES.map((f) => {
    const rand = seededRandom(charSum(f.id) * 71 + 17)
    const hasReportedToday = rand() < 0.75
    const reportingStreak = Math.floor(rand() * 91)
    const lateSubmissions = Math.floor(rand() * 9)
    const zeroReportFlags = Math.floor(rand() * 11)
    const completenessScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          ((reportingStreak / 90) * 0.4 +
            (1 - lateSubmissions / 30) * 0.4 +
            (1 - zeroReportFlags / 30) * 0.2) *
            100
        )
      )
    )
    const daysSinceLastReport = hasReportedToday ? 0 : 1 + Math.floor(rand() * 7)
    const lastReportDate = format(
      subDays(parseISO(DEMO_TODAY), daysSinceLastReport),
      'd MMM'
    )

    return {
      id: f.id,
      name: f.name,
      level: f.level,
      districtName: districtById.get(f.districtId)?.name ?? f.districtId,
      hasReportedToday,
      reportingStreak,
      lateSubmissions,
      zeroReportFlags,
      completenessScore,
      daysSinceLastReport,
      lastReportDate,
    }
  })
}

function buildWeeklyTrend() {
  const rand = seededRandom(4242)
  return Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`,
    completeness: Math.round(68 + rand() * 21),
  }))
}

function barColor(v: number) {
  return v > 80 ? '#22c55e' : v > 60 ? '#f59e0b' : '#ef4444'
}

export default function DataQualityPage() {
  const data = useMemo(() => buildQuality(), [])
  const weekly = useMemo(() => buildWeeklyTrend(), [])
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // KPIs — reporting rate & on-time now come from real monthly seed data.
  const realKpis = getNationalMonthlyKPIs()
  const reportingRate = realKpis.avgReportingCompleteness
  const onTimeRate = realKpis.avgReportingTimeliness
  const zeroInflation = data.filter((d) => d.zeroReportFlags > 5).length
  const avgCompleteness = Math.round(
    data.reduce((s, d) => s + d.completenessScore, 0) / data.length
  )

  const nonReporting = data.filter((d) => !d.hasReportedToday)
  const zeroFlags = data
    .filter((d) => d.zeroReportFlags > 3)
    .sort((a, b) => b.zeroReportFlags - a.zeroReportFlags)

  // District completeness
  const byDistrict = useMemo(() => {
    const map = new Map<string, { sum: number; n: number }>()
    for (const d of data) {
      const e = map.get(d.districtName) ?? { sum: 0, n: 0 }
      e.sum += d.completenessScore
      e.n += 1
      map.set(d.districtName, e)
    }
    return [...map.entries()]
      .map(([district, { sum, n }]) => ({
        district,
        completeness: Math.round(sum / n),
      }))
      .sort((a, b) => b.completeness - a.completeness)
  }, [data])

  return (
    <div className="space-y-6">
      {/* Row 1 — header */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Data Quality &amp; Reporting Completeness
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitoring report timeliness, completeness and data plausibility
            across all facilities
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Reporting period: Last 30 days
        </span>
      </div>

      {/* Row 2 — KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          title="Reporting Rate Today"
          value={`${reportingRate}%`}
          icon={CheckSquare}
          iconColor={reportingRate > 80 ? 'text-green-400' : reportingRate < 60 ? 'text-red-600' : 'text-amber-500'}
          iconBg={reportingRate > 80 ? 'bg-green-500/10' : reportingRate < 60 ? 'bg-red-500/10' : 'bg-amber-500/10'}
        />
        <KpiCard title="On-Time Submissions" value={`${onTimeRate}%`} icon={Clock} />
        <KpiCard
          title="Suspected Zero-Inflation"
          value={zeroInflation}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-500/10"
          alert={zeroInflation > 0}
        />
        <KpiCard
          title="Average Completeness Score"
          value={avgCompleteness}
          icon={CheckSquare}
        />
      </div>

      {/* Row 3 — completeness trend */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          National Reporting Completeness — Last 8 Weeks
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={weekly} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`${v}%`, 'Completeness']} />
            <ReferenceLine
              y={80}
              stroke="#16a34a"
              strokeDasharray="4 4"
              label={{ value: 'MoH Target', position: 'insideTopRight', fontSize: 11, fill: '#16a34a' }}
            />
            <Line
              type="monotone"
              dataKey="completeness"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Row 4 — non-reporting + zero flags */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[11fr_9fr]">
        {/* Non-reporting */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            {nonReporting.length} facilities not yet reported today
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Facility</th>
                  <th className="pb-2 font-medium">District</th>
                  <th className="pb-2 font-medium">Last report</th>
                  <th className="pb-2 font-medium">Days</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {nonReporting.map((d) => (
                  <tr key={d.id} className="border-b last:border-0">
                    <td className="py-2">
                      <span className="font-medium text-foreground">{d.name}</span>{' '}
                      <span className="rounded bg-muted px-1 py-0.5 text-xs text-muted-foreground">
                        {d.level}
                      </span>
                    </td>
                    <td className="py-2 text-muted-foreground">{d.districtName}</td>
                    <td className="py-2 text-muted-foreground">{d.lastReportDate}</td>
                    <td
                      className={cn(
                        'py-2 tabular-nums',
                        d.daysSinceLastReport > 3 ? 'font-medium text-red-600' : 'text-foreground'
                      )}
                    >
                      {d.daysSinceLastReport}
                    </td>
                    <td className="py-2 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => showToast(`Alert sent to ${d.name} in-charge via SMS`)}
                      >
                        Contact
                      </Button>
                    </td>
                  </tr>
                ))}
                {nonReporting.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      All facilities have reported today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Zero-report flags */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Zero-Report Flags
          </h3>
          <ul className="space-y-2">
            {zeroFlags.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">
                    {d.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{d.districtName}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
                    {d.zeroReportFlags} flags
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => showToast(`Investigation request logged for ${d.name}`)}
                  >
                    Investigate
                  </Button>
                </div>
              </li>
            ))}
            {zeroFlags.length === 0 && (
              <li className="text-sm text-muted-foreground">No flagged facilities.</li>
            )}
          </ul>
          <p className="mt-4 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
            Zero reports may indicate data entry issues, genuine disease absence,
            or connectivity problems. DHO follow-up recommended for flagged
            facilities.
          </p>
        </div>
      </div>

      {/* Row 5 — completeness by district */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Completeness by District
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byDistrict} margin={{ top: 8, right: 16, bottom: 60, left: 0 }}>
            <XAxis
              dataKey="district"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fontSize: 10, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`${v}%`, 'Completeness']} cursor={{ fill: '#f1f5f9' }} />
            <Bar dataKey="completeness" radius={[4, 4, 0, 0]}>
              {byDistrict.map((d, i) => (
                <Cell key={i} fill={barColor(d.completeness)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
