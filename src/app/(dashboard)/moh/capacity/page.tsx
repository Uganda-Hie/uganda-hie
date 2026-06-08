'use client'

import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AlertTriangle, ArrowRightCircle, Wind, Check, X } from 'lucide-react'
import { FACILITIES } from '@/data/facilities'
import { DISTRICTS } from '@/data/districts'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type OccStatus = 'critical' | 'high' | 'moderate' | 'ok'
type OxyStatus = 'critical' | 'watch' | 'ok'

interface Cap {
  id: string
  name: string
  level: string
  districtName: string
  region: string
  totalBeds: number
  occupiedBeds: number
  icuOccupied: number
  pendingReferrals: number
  oxygenDaysRemaining: number
  ventilators: number
  covidIsolationBeds: number
  occupancyPercent: number
  occupancyStatus: OccStatus
  oxygenStatus: OxyStatus
  hasAmbulance: boolean
}

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}
const charSum = (str: string) =>
  [...str].reduce((sum, c) => sum + c.charCodeAt(0), 0)

const OCC_BAR: Record<OccStatus, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  moderate: 'bg-amber-400',
  ok: 'bg-green-500',
}
const OCC_BADGE: Record<OccStatus, string> = {
  critical: 'bg-red-500/15 text-red-400',
  high: 'bg-orange-500/15 text-orange-400',
  moderate: 'bg-amber-500/15 text-amber-400',
  ok: 'bg-green-500/15 text-green-400',
}
const OCC_LABEL: Record<OccStatus, string> = {
  critical: 'Critical',
  high: 'High',
  moderate: 'Moderate',
  ok: 'OK',
}

function buildCapacity(): Cap[] {
  const regionByDistrict = new Map(DISTRICTS.map((d) => [d.id, d]))
  return FACILITIES.map((f) => {
    const rand = seededRandom(charSum(f.id) * 53 + 11)
    const isBig = f.level === 'RRH' || f.level === 'NRH' || f.level === 'Hospital'
    const isTop = f.level === 'RRH' || f.level === 'NRH'

    const occupiedBeds = Math.round(f.totalBeds * (0.4 + rand() * 0.58))
    const icuOccupied = isBig
      ? Math.round(f.totalBeds * 0.05 * (0.6 + rand() * 0.4))
      : 0
    const pendingReferrals = Math.floor(rand() * 13)
    const oxygenDaysRemaining = Math.round(2 + rand() * 19)
    const ventilators = isTop ? Math.round(2 + rand() * 6) : 0
    const covidIsolationBeds = Math.floor(rand() * 5)

    const occupancyPercent = Math.round((occupiedBeds / f.totalBeds) * 100)
    const occupancyStatus: OccStatus =
      occupancyPercent > 90
        ? 'critical'
        : occupancyPercent > 80
          ? 'high'
          : occupancyPercent > 65
            ? 'moderate'
            : 'ok'
    const oxygenStatus: OxyStatus =
      oxygenDaysRemaining < 5 ? 'critical' : oxygenDaysRemaining < 10 ? 'watch' : 'ok'

    const district = regionByDistrict.get(f.districtId)
    return {
      id: f.id,
      name: f.name,
      level: f.level,
      districtName: district?.name ?? f.districtId,
      region: district?.region ?? '—',
      totalBeds: f.totalBeds,
      occupiedBeds,
      icuOccupied,
      pendingReferrals,
      oxygenDaysRemaining,
      ventilators,
      covidIsolationBeds,
      occupancyPercent,
      occupancyStatus,
      oxygenStatus,
      hasAmbulance: f.hasAmbulance,
    }
  })
}

const REGIONS = ['all', 'Northern', 'Eastern', 'Western', 'Central']
const LEVELS = ['all', 'NRH', 'RRH', 'Hospital', 'HCIV']
type SortKey = 'name' | 'occupancyPercent' | 'pendingReferrals' | 'oxygenDaysRemaining'

export default function CapacityPage() {
  const data = useMemo(() => buildCapacity(), [])

  const [region, setRegion] = useState('all')
  const [level, setLevel] = useState('all')
  const [criticalOnly, setCriticalOnly] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('occupancyPercent')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  const filtered = useMemo(() => {
    const rows = data.filter(
      (c) =>
        (region === 'all' || c.region === region) &&
        (level === 'all' || c.level === level) &&
        (!criticalOnly || c.occupancyStatus === 'critical')
    )
    return rows.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'name') return a.name.localeCompare(b.name) * dir
      return (a[sortKey] - b[sortKey]) * dir
    })
  }, [data, region, level, criticalOnly, sortKey, sortDir])

  // KPIs (over the filtered set so the controls drive everything).
  const avgOcc = filtered.length
    ? Math.round(
        filtered.reduce((s, c) => s + c.occupancyPercent, 0) / filtered.length
      )
    : 0
  const criticalCount = filtered.filter((c) => c.occupancyStatus === 'critical').length
  const totalReferrals = filtered.reduce((s, c) => s + c.pendingReferrals, 0)
  const oxygenAtRisk = filtered.filter((c) => c.oxygenStatus !== 'ok').length

  const referralChart = [...filtered]
    .sort((a, b) => b.pendingReferrals - a.pendingReferrals)
    .slice(0, 8)
    .map((c) => ({ name: c.name, referrals: c.pendingReferrals }))

  const oxygenRisk = [...filtered]
    .filter((c) => c.oxygenDaysRemaining < 14)
    .sort((a, b) => a.oxygenDaysRemaining - b.oxygenDaysRemaining)

  const sortArrow = (k: SortKey) =>
    sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  return (
    <div className="space-y-6">
      {/* Row 1 — header + filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="text-xl font-bold text-foreground">
          Hospital Capacity &amp; Referral Intelligence
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r} className="capitalize">
                  {r === 'all' ? 'All Regions' : r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l === 'all' ? 'All Levels' : l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Switch checked={criticalOnly} onCheckedChange={setCriticalOnly} />
            Show critical only
          </label>
        </div>
      </div>

      {/* Row 2 — KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          title="Avg Bed Occupancy"
          value={`${avgOcc}%`}
          icon={Wind}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          alert={avgOcc > 80}
        />
        <KpiCard
          title="Facilities at Critical Capacity"
          value={criticalCount}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-500/10"
          alert={criticalCount > 0}
        />
        <KpiCard
          title="Total Pending Referrals"
          value={totalReferrals}
          icon={ArrowRightCircle}
        />
        <KpiCard
          title="Oxygen at Risk"
          value={oxygenAtRisk}
          icon={Wind}
          iconColor="text-red-600"
          iconBg="bg-red-500/10"
          alert={oxygenAtRisk > 3}
        />
      </div>

      {/* Row 3 — capacity table */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Facility Capacity Overview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th
                  className="cursor-pointer pb-2 font-medium"
                  onClick={() => toggleSort('name')}
                >
                  Facility{sortArrow('name')}
                </th>
                <th className="pb-2 font-medium">District</th>
                <th className="pb-2 font-medium">Beds</th>
                <th
                  className="cursor-pointer pb-2 font-medium"
                  onClick={() => toggleSort('occupancyPercent')}
                >
                  Occupancy{sortArrow('occupancyPercent')}
                </th>
                <th
                  className="cursor-pointer pb-2 font-medium"
                  onClick={() => toggleSort('pendingReferrals')}
                >
                  Referrals{sortArrow('pendingReferrals')}
                </th>
                <th
                  className="cursor-pointer pb-2 font-medium"
                  onClick={() => toggleSort('oxygenDaysRemaining')}
                >
                  Oxygen{sortArrow('oxygenDaysRemaining')}
                </th>
                <th className="pb-2 font-medium">Amb.</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-2">
                    <span className="font-medium text-foreground">{c.name}</span>{' '}
                    <span className="rounded bg-muted px-1 py-0.5 text-xs text-muted-foreground">
                      {c.level}
                    </span>
                  </td>
                  <td className="py-2 text-muted-foreground">{c.districtName}</td>
                  <td className="py-2 tabular-nums text-foreground">
                    {c.occupiedBeds}/{c.totalBeds}
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn('h-full rounded-full', OCC_BAR[c.occupancyStatus])}
                          style={{ width: `${Math.min(100, c.occupancyPercent)}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-xs text-muted-foreground">
                        {c.occupancyPercent}%
                      </span>
                    </div>
                  </td>
                  <td
                    className={cn(
                      'py-2 tabular-nums',
                      c.pendingReferrals > 5 ? 'font-medium text-red-600' : 'text-foreground'
                    )}
                  >
                    {c.pendingReferrals}
                  </td>
                  <td
                    className={cn(
                      'py-2 tabular-nums',
                      c.oxygenDaysRemaining < 5
                        ? 'font-medium text-red-600'
                        : c.oxygenDaysRemaining < 10
                          ? 'font-medium text-amber-400'
                          : 'text-foreground'
                    )}
                  >
                    {c.oxygenDaysRemaining}d
                  </td>
                  <td className="py-2">
                    {c.hasAmbulance ? (
                      <Check className="size-4 text-green-500" />
                    ) : (
                      <X className="size-4 text-red-500" />
                    )}
                  </td>
                  <td className="py-2">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        OCC_BADGE[c.occupancyStatus]
                      )}
                    >
                      {OCC_LABEL[c.occupancyStatus]}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-muted-foreground">
                    No facilities match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4 — referral pressure + oxygen risk */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Referral pressure */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Referral Pressure
          </h3>
          {referralChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={referralChart}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
              >
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="referrals" radius={[0, 4, 4, 0]}>
                  {referralChart.map((d, i) => (
                    <Cell key={i} fill={d.referrals > 5 ? '#dc2626' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No referral data.</p>
          )}
        </div>

        {/* Oxygen risk */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Oxygen Supply Risk
          </h3>
          {oxygenRisk.length > 0 ? (
            <ul className="space-y-3">
              {oxygenRisk.map((c) => {
                const pct = Math.min(100, Math.round((c.oxygenDaysRemaining / 14) * 100))
                const color =
                  c.oxygenDaysRemaining < 5
                    ? 'text-red-600'
                    : c.oxygenDaysRemaining < 10
                      ? 'text-amber-400'
                      : 'text-foreground'
                const bar =
                  c.oxygenDaysRemaining < 5
                    ? 'bg-red-500'
                    : c.oxygenDaysRemaining < 10
                      ? 'bg-amber-400'
                      : 'bg-green-500'
                return (
                  <li key={c.id} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm text-foreground">
                          {c.name}
                          <span className="ml-1 text-xs text-muted-foreground">
                            · {c.districtName}
                          </span>
                        </span>
                        <span className={cn('shrink-0 text-sm font-semibold', color)}>
                          {c.oxygenDaysRemaining}d
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className={cn('h-full rounded-full', bar)} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      onClick={() => showToast(`Supply request logged for ${c.name}`)}
                    >
                      Order Supplies
                    </Button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="rounded-lg bg-green-500/10 px-4 py-6 text-center text-sm font-medium text-green-400">
              All facilities have adequate oxygen supply
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
