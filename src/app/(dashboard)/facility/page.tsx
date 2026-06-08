'use client'

import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import {
  Users,
  BedDouble,
  Bed,
  ArrowRightCircle,
  ArrowRight,
  Droplets,
  Ambulance,
} from 'lucide-react'
import { useDemoStore } from '@/store/demo-store'
import { DEMO_USERS } from '@/types/user'
import { getFacilityById } from '@/data/facilities'
import { generateStockLevels, type StockRisk } from '@/data/stock'
import { getLatestReport, getReportsByFacility } from '@/data/daily-reports'
import type { DailyReport } from '@/types/report'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

const FACILITY_ID = 'f011' // Karenga HCIII

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
  const activeUser = DEMO_USERS.find((u) => u.role === activeRole)

  const facility = getFacilityById(FACILITY_ID)
  const latest = getLatestReport(FACILITY_ID)
  const reports = getReportsByFacility(FACILITY_ID).sort((a, b) =>
    b.reportDate.localeCompare(a.reportDate)
  )
  const prev = reports[1]

  const stock = generateStockLevels(FACILITY_ID)
    .slice()
    .sort((a, b) => a.daysOfStock - b.daysOfStock)
    .slice(0, 6)

  const occupancyPct =
    latest && latest.totalBeds > 0
      ? Math.round((latest.occupiedBeds / latest.totalBeds) * 100)
      : 0

  const diseaseRows: { label: string; key: keyof DailyReport }[] = [
    { label: 'Malaria Suspected', key: 'malariaSuspected' },
    { label: 'Malaria Confirmed', key: 'malariaConfirmed' },
    { label: 'Cholera', key: 'cholera' },
    { label: 'Measles', key: 'measles' },
    { label: 'Respiratory', key: 'respiratory' },
    { label: 'Diarrhoeal', key: 'diarrhoeal' },
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
        <div className="mt-4 border-t pt-3 text-xs">
          {latest ? (
            <span className="text-muted-foreground">
              Last report submitted: {formatDate(latest.reportDate)}
            </span>
          ) : (
            <span className="font-medium text-amber-400">
              No report today yet
            </span>
          )}
        </div>
      </div>

      {/* Row 2 — KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard title="OPD Visits Today" value={latest?.opdVisits ?? 0} icon={Users} />
        <KpiCard title="Admissions" value={latest?.admissions ?? 0} icon={BedDouble} />
        <KpiCard
          title="Bed Occupancy"
          value={`${occupancyPct}%`}
          icon={Bed}
          alert={occupancyPct > 85}
        />
        <KpiCard
          title="Referrals Out"
          value={latest?.referralsOut ?? 0}
          icon={ArrowRightCircle}
        />
      </div>

      {/* Row 3 — disease tally + stock */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Disease tally */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Today&apos;s Disease Tally
          </h3>
          {latest ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Disease</th>
                  <th className="pb-2 text-right font-medium">Count</th>
                  <th className="pb-2 text-right font-medium">vs Yesterday</th>
                </tr>
              </thead>
              <tbody>
                {diseaseRows.map((row) => {
                  const count = (latest[row.key] as number) ?? 0
                  const delta = prev
                    ? count - ((prev[row.key] as number) ?? 0)
                    : null
                  return (
                    <tr key={row.label} className="border-b last:border-0">
                      <td className="py-2 text-foreground">{row.label}</td>
                      <td className="py-2 text-right font-medium tabular-nums">
                        {count}
                      </td>
                      <td className="py-2 text-right tabular-nums">
                        <Delta value={delta} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="rounded-lg bg-amber-500/10 px-4 py-6 text-center text-sm text-amber-400">
              No report submitted today.{' '}
              <Link href="/facility/report" className="font-medium underline">
                Submit now
              </Link>
            </div>
          )}
        </div>

        {/* Stock status */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Stock Status</h3>
          <ul className="space-y-3">
            {stock.map((s) => {
              const pct = Math.min(100, Math.round((s.daysOfStock / 30) * 100))
              return (
                <li key={s.item.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground">{s.item.name}</span>
                    <span className={`font-semibold ${RISK_TEXT[s.riskLevel]}`}>
                      {s.daysOfStock}d
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${RISK_BAR[s.riskLevel]}`}
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
      {latest ? (
        <div className="flex items-center justify-between rounded-xl bg-green-500/10 px-5 py-4 text-sm text-green-400">
          <span>
            ✓ Today&apos;s report submitted at{' '}
            {format(parseISO(latest.submittedAt), 'HH:mm')}. Next report due
            tomorrow at 07:00.
          </span>
        </div>
      ) : (
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
      )}
    </div>
  )
}
