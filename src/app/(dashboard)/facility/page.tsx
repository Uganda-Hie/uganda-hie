'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Users,
  BedDouble,
  Bed,
  ArrowRightCircle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Droplets,
  Ambulance,
  Wifi,
  Clock,
  CloudOff,
} from 'lucide-react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { useDemoStore } from '@/store/demo-store'
import { DEMO_USERS } from '@/types/user'
import { getFacilityById } from '@/data/facilities'
import { generateStockLevels, type StockRisk } from '@/data/stock'
import { DEMO_SCENARIOS } from '@/lib/demo-scenarios'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { Button } from '@/components/ui/button'

const FACILITY_ID = 'f011' // Karenga HCIII
const TOTAL_BEDS = 20
const OCCUPIED_BEDS = 14 // 70% — realistic for a remote HCIII

const RISK_TEXT: Record<StockRisk, string> = {
  critical: 'text-red-600',
  high: 'text-orange-400',
  watch: 'text-amber-400',
  ok: 'text-green-400',
}
const RISK_BAR: Record<StockRisk, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  watch: 'bg-amber-400',
  ok: 'bg-green-500',
}

function riskFromDays(days: number): StockRisk {
  if (days < 7) return 'critical'
  if (days < 14) return 'high'
  if (days < 30) return 'watch'
  return 'ok'
}

function StatusBadge({ ok, on, off }: { ok: boolean; on: string; off: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        ok ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
      }`}
    >
      {ok ? on : off}
    </span>
  )
}

function Delta({ value }: { value: number | null }) {
  if (value === null) return <span className="text-muted-foreground">—</span>
  if (value === 0) return <span className="text-muted-foreground">0</span>
  const up = value > 0
  return (
    <span className={up ? 'text-red-600' : 'text-green-400'}>
      {up ? '+' : ''}
      {value}
    </span>
  )
}

export default function FacilityHomePage() {
  const activeRole = useDemoStore((s) => s.activeRole)
  const scenario = useDemoStore((s) => s.scenario)
  const overrides = useDemoStore((s) => s.nurseReportOverrides)
  const activeUser = DEMO_USERS.find((u) => u.role === activeRole)
  const activeScenario =
    DEMO_SCENARIOS.find((s) => s.key === scenario) ?? DEMO_SCENARIOS[0]

  const facility = getFacilityById(FACILITY_ID)

  // After 16:00 the daily report is overdue — flagged client-side to avoid
  // an SSR/CSR hydration mismatch on the time-of-day.
  const [afterCutoff, setAfterCutoff] = useState(false)
  useEffect(() => {
    setAfterCutoff(new Date().getHours() >= 16)
  }, [])

  const occupancyPct = Math.round((OCCUPIED_BEDS / TOTAL_BEDS) * 100)

  // Disease tally derived from the active scenario's nurse report.
  const prevFactor = activeScenario.trendPattern === 'spike' ? 0.6 : 0.9
  const respiratory = Math.round(overrides.opdVisits * 0.15)
  const diarrhoeal = Math.round(overrides.opdVisits * 0.1)
  const tally: { label: string; count: number }[] = [
    { label: 'Malaria Suspected', count: overrides.malariaSuspected },
    { label: 'Malaria Confirmed', count: overrides.malariaConfirmed },
    { label: 'Cholera', count: overrides.cholera },
    { label: 'Measles', count: 0 },
    { label: 'Respiratory', count: respiratory },
    { label: 'Diarrhoeal', count: diarrhoeal },
  ]

  // Stock — ACT/RDT pulled from the scenario, the rest from the facility model.
  const baseStock = generateStockLevels(FACILITY_ID).filter(
    (s) => s.item.id !== 'acts' && s.item.id !== 'rdts'
  )
  const stock = [
    {
      id: 'acts',
      name: 'ACTs (Artemether-Lumefantrine)',
      days: overrides.actStock,
      risk: riskFromDays(overrides.actStock),
    },
    {
      id: 'rdts',
      name: 'RDTs (Malaria Rapid Tests)',
      days: overrides.rdtStock,
      risk: riskFromDays(overrides.rdtStock),
    },
    ...baseStock.map((s) => ({
      id: s.item.id,
      name: s.item.name,
      days: s.daysOfStock,
      risk: s.riskLevel,
    })),
  ]
    .sort((a, b) => a.days - b.days)
    .slice(0, 6)

  // Weekly malaria trend mini-card.
  const malariaThisWeek = overrides.malariaConfirmed
  const malariaLastWeek = Math.round(malariaThisWeek * 0.7)
  const trendUp = malariaThisWeek >= malariaLastWeek
  const spark = [
    { x: 0, v: malariaLastWeek },
    { x: 1, v: Math.round((malariaLastWeek + malariaThisWeek) / 2) },
    { x: 2, v: malariaThisWeek },
  ]

  if (!facility) {
    return <p className="text-muted-foreground">Facility not found.</p>
  }

  return (
    <div className="space-y-6">
      {/* Row 1 — Facility header */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">{facility.name}</h2>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {facility.level}
              </span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {facility.ownership}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeUser?.district ? `${activeUser.district}, ` : ''}Northern Region
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Droplets className="size-3.5" /> Oxygen
            </span>
            <StatusBadge ok={facility.hasOxygen} on="Available" off="Not Available" />
            <span className="ml-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Ambulance className="size-3.5" /> Ambulance
            </span>
            <StatusBadge
              ok={facility.hasAmbulance}
              on="Operational"
              off="Unavailable"
            />
          </div>
        </div>

        {/* Status indicators */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3 text-xs">
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${
              afterCutoff
                ? 'bg-amber-500/15 text-amber-400'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Clock className="size-3.5" /> Report due by 20:00
          </span>
          <span className="flex items-center gap-1 rounded-full bg-gray-500/15 px-2.5 py-1 font-medium text-gray-400">
            <Wifi className="size-3.5" /> Low bandwidth mode
          </span>
          {scenario === 'malaria-surge' && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 font-medium text-amber-400">
              <CloudOff className="size-3.5" /> 2 offline entries saved
            </span>
          )}
          <span className="ml-auto text-muted-foreground">
            Last synced: 6 hours ago
          </span>
        </div>
      </div>

      {/* Row 2 — KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard title="OPD Visits Today" value={overrides.opdVisits} icon={Users} />
        <KpiCard title="Admissions" value={overrides.admissions} icon={BedDouble} />
        <KpiCard
          title="Bed Occupancy"
          value={`${occupancyPct}%`}
          subtitle={`${OCCUPIED_BEDS} / ${TOTAL_BEDS} beds`}
          icon={Bed}
          alert={occupancyPct > 85}
        />
        <KpiCard
          title="Referrals Out"
          value={overrides.referralsOut}
          icon={ArrowRightCircle}
        />
      </div>

      {/* Row 2b — Weekly malaria trend mini-card */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Malaria cases this week vs last week
        </h3>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-end gap-6">
            <div>
              <div className="text-xs text-muted-foreground">This week</div>
              <div className="text-2xl font-bold tabular-nums text-foreground">
                {malariaThisWeek}
              </div>
            </div>
            <div className="pb-1">
              {trendUp ? (
                <ArrowUpRight className="size-6 text-red-500" />
              ) : (
                <ArrowDownRight className="size-6 text-green-500" />
              )}
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last week</div>
              <div className="text-2xl font-bold tabular-nums text-muted-foreground">
                {malariaLastWeek}
              </div>
            </div>
          </div>
          <div className="h-12 w-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spark}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={trendUp ? '#ef4444' : '#22c55e'}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3 — disease tally + stock */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Disease tally */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Today&apos;s Disease Tally
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Disease</th>
                <th className="pb-2 text-right font-medium">Count</th>
                <th className="pb-2 text-right font-medium">vs Yesterday</th>
              </tr>
            </thead>
            <tbody>
              {tally.map((row) => {
                const prev = Math.round(row.count * prevFactor)
                const delta = row.count - prev
                return (
                  <tr key={row.label} className="border-b last:border-0">
                    <td className="py-2 text-foreground">{row.label}</td>
                    <td className="py-2 text-right font-medium tabular-nums">
                      {row.count}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      <Delta value={delta} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Stock status */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Stock Status</h3>
          <ul className="space-y-3">
            {stock.map((s) => {
              const pct = Math.min(100, Math.round((s.days / 30) * 100))
              return (
                <li key={s.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground">{s.name}</span>
                    <span className={`font-semibold ${RISK_TEXT[s.risk]}`}>
                      {s.days}d
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${RISK_BAR[s.risk]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Row 4 — Report CTA */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-xl bg-amber-500/10 px-5 py-4 sm:flex-row sm:items-center">
        <span className="text-sm text-amber-400">
          Daily report not yet submitted for today. Submission closes at 20:00.
        </span>
        <Button asChild>
          <Link href="/facility/report">
            Submit Report Now <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
