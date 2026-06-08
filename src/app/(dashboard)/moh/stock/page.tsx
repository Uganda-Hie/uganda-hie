'use client'

import { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { AlertTriangle, Eye, Package, CheckCircle } from 'lucide-react'
import { FACILITIES } from '@/data/facilities'
import { DISTRICTS } from '@/data/districts'
import { STOCK_ITEMS, generateStockLevels } from '@/data/stock'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const REGIONS = ['all', 'Northern', 'Eastern', 'Western', 'Central']

function dayColor(days: number) {
  return days < 7 ? '#ef4444' : days < 14 ? '#f59e0b' : '#22c55e'
}
function truncate(s: string, n = 20) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

export default function StockPage() {
  // facilityId -> { itemId -> daysOfStock }, computed once.
  const stockByFacility = useMemo(() => {
    const m: Record<string, Record<string, number>> = {}
    for (const f of FACILITIES) {
      m[f.id] = Object.fromEntries(
        generateStockLevels(f.id).map((l) => [l.item.id, l.daysOfStock])
      )
    }
    return m
  }, [])

  const regionByFacility = useMemo(() => {
    const districtById = new Map(DISTRICTS.map((d) => [d.id, d]))
    const m: Record<string, { region: string; district: string }> = {}
    for (const f of FACILITIES) {
      const d = districtById.get(f.districtId)
      m[f.id] = { region: d?.region ?? '—', district: d?.name ?? f.districtId }
    }
    return m
  }, [])

  const [commodity, setCommodity] = useState('acts')
  const [region, setRegion] = useState('all')
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const facilitiesInRegion = useMemo(
    () =>
      FACILITIES.filter(
        (f) => region === 'all' || regionByFacility[f.id].region === region
      ),
    [region, regionByFacility]
  )

  const commodityLabel =
    STOCK_ITEMS.find((i) => i.id === commodity)?.name ?? commodity

  // Rows for the selected commodity across the region-filtered facilities.
  const rows = useMemo(
    () =>
      facilitiesInRegion.map((f) => ({
        id: f.id,
        name: f.name,
        level: f.level,
        district: regionByFacility[f.id].district,
        days: stockByFacility[f.id][commodity] ?? 0,
      })),
    [facilitiesInRegion, regionByFacility, stockByFacility, commodity]
  )

  const critical = rows.filter((r) => r.days < 7)
  const watch = rows.filter((r) => r.days >= 7 && r.days < 14)
  const wellStocked = rows.filter((r) => r.days >= 30)
  const avgDays = rows.length
    ? Math.round(rows.reduce((s, r) => s + r.days, 0) / rows.length)
    : 0

  const chartData = [...rows].sort((a, b) => a.days - b.days).slice(0, 20)
  const criticalList = [...critical].sort((a, b) => a.days - b.days)

  // Commodity overview across the region-filtered facilities.
  const overview = useMemo(
    () =>
      STOCK_ITEMS.map((item) => {
        const ds = facilitiesInRegion.map((f) => stockByFacility[f.id][item.id] ?? 0)
        const crit = ds.filter((d) => d < 7).length
        const wat = ds.filter((d) => d >= 7 && d < 14).length
        const ok = ds.filter((d) => d >= 14).length
        return {
          item,
          crit,
          wat,
          ok,
          pctOk: ds.length ? Math.round((ok / ds.length) * 100) : 0,
        }
      }),
    [facilitiesInRegion, stockByFacility]
  )

  return (
    <div className="space-y-6">
      {/* Row 1 — header + controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="text-xl font-bold text-foreground">
          National Medicine &amp; Supply Intelligence
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={commodity} onValueChange={setCommodity}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Commodity" />
            </SelectTrigger>
            <SelectContent>
              {STOCK_ITEMS.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r === 'all' ? 'All Regions' : r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => showToast('Export feature available in production deployment')}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Row 2 — KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          title="Facilities at Critical Risk"
          value={critical.length}
          subtitle="< 7 days of stock"
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-500/10"
          alert
        />
        <KpiCard
          title="Facilities at Watch"
          value={watch.length}
          subtitle="7–14 days"
          icon={Eye}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
        />
        <KpiCard
          title="National Avg Days of Stock"
          value={avgDays}
          icon={Package}
        />
        <KpiCard
          title="Facilities Well Stocked"
          value={wellStocked.length}
          subtitle="≥ 30 days"
          icon={CheckCircle}
          iconColor="text-green-400"
          iconBg="bg-green-500/10"
        />
      </div>

      {/* Row 3 — distribution + critical list */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[13fr_7fr]">
        {/* Distribution chart */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            {commodityLabel} — Days of Stock by Facility
          </h3>
          <ResponsiveContainer width="100%" height={Math.max(320, chartData.length * 22)}>
            <BarChart
              data={chartData.map((d) => ({ ...d, label: truncate(d.name) }))}
              layout="vertical"
              margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
            >
              <XAxis type="number" domain={[0, 60]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={150}
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(v) => [`${v} days`, 'Stock']} />
              <Bar
                dataKey="days"
                radius={[0, 4, 4, 0]}
                onClick={(d) => setSelectedFacility((d as { id?: string }).id ?? null)}
              >
                {chartData.map((d) => (
                  <Cell
                    key={d.id}
                    fill={dayColor(d.days)}
                    stroke={selectedFacility === d.id ? '#1e293b' : undefined}
                    strokeWidth={selectedFacility === d.id ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Critical list */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Immediate Action Required
          </h3>
          {criticalList.length > 0 ? (
            <ul className="space-y-2">
              {criticalList.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">
                      {r.name}{' '}
                      <span className="rounded bg-muted px-1 py-0.5 text-xs text-muted-foreground">
                        {r.level}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{r.district}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-bold text-red-600">{r.days}d</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        showToast(
                          `Restock request submitted to National Medical Stores for ${r.name}`
                        )
                      }
                    >
                      Request Restock
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg bg-green-500/10 px-4 py-6 text-center text-sm font-medium text-green-400">
              No critical stock-outs detected
            </div>
          )}
        </div>
      </div>

      {/* Row 4 — commodity overview */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          All Commodities at a Glance
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {overview.map((o) => (
            <button
              key={o.item.id}
              type="button"
              onClick={() => setCommodity(o.item.id)}
              className={cn(
                'rounded-lg border p-4 text-left transition-colors hover:bg-muted',
                o.crit > 0 && 'border-red-300',
                commodity === o.item.id && 'ring-2 ring-blue-500'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  {o.item.name}
                </span>
                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs capitalize text-muted-foreground">
                  {o.item.category}
                </span>
              </div>
              <div className="mt-2 flex gap-4 text-sm">
                <span className="font-semibold text-red-600">{o.crit} crit</span>
                <span className="font-semibold text-amber-400">{o.wat} watch</span>
                <span className="font-semibold text-green-400">{o.ok} ok</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${o.pctOk}%` }}
                />
              </div>
            </button>
          ))}
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
