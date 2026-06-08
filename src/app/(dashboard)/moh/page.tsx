'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Building2,
  CheckCircle,
  Activity,
  AlertTriangle,
  Bed,
  Package,
  ArrowRight,
  Map,
} from 'lucide-react'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { TrendChart } from '@/components/dashboard/trend-chart'
import { AlertBanner, type DashboardAlert } from '@/components/dashboard/alert-banner'
import { AiBrief } from '@/components/dashboard/ai-brief'
import { getNationalKPIs } from '@/lib/metrics'
import { getNationalSummary, getTopDistricts } from '@/data/districts'
import { getSeverityColor, getSeverityLabel } from '@/lib/severity'
import { useDemoStore } from '@/store/demo-store'
import { DISEASES } from '@/types/disease'
import type { Disease } from '@/store/demo-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const INITIAL_ALERTS: DashboardAlert[] = [
  {
    id: 'a1',
    district: 'Arua',
    disease: 'Malaria',
    severity: 'critical',
    message: 'Cases 2.3x above baseline',
  },
  {
    id: 'a2',
    district: 'Tororo',
    disease: 'Cholera',
    severity: 'high',
    message: 'Cluster detected near landing sites',
  },
]

const QUICK_LINKS = [
  {
    href: '/moh/disease-map',
    title: 'Disease Intelligence & Map',
    description: 'District hotspot map, severity rankings, outbreak detection',
  },
  {
    href: '/moh/capacity',
    title: 'Hospital Capacity',
    description: 'Bed occupancy, oxygen, ICU availability, referral pressure',
  },
  {
    href: '/moh/stock',
    title: 'Medicine Stock',
    description: 'Days of stock, stock-out risk, redistribution alerts',
  },
]

export default function MohSnapshotPage() {
  const selectedDisease = useDemoStore((s) => s.selectedDisease)
  const setDisease = useDemoStore((s) => s.setDisease)

  const [alerts, setAlerts] = useState<DashboardAlert[]>(INITIAL_ALERTS)
  const [today, setToday] = useState('')
  useEffect(() => setToday(format(new Date(), 'd MMM yyyy')), [])

  const kpis = getNationalKPIs()
  const summary = getNationalSummary(selectedDisease)
  const topDistricts = getTopDistricts(selectedDisease, 3)
  const diseaseLabel =
    DISEASES.find((d) => d.key === selectedDisease)?.label ?? 'Disease'

  // Derived colour logic for KPI icons.
  const completeness = parseInt(kpis.reportingCompleteness, 10)
  const complColor =
    completeness > 80 ? 'text-green-600' : completeness > 60 ? 'text-amber-500' : 'text-red-600'
  const complBg =
    completeness > 80 ? 'bg-green-50' : completeness > 60 ? 'bg-amber-50' : 'bg-red-50'

  const districtsOnAlert = summary.criticalDistricts + summary.highDistricts
  const alertColor =
    districtsOnAlert > 3 ? 'text-red-600' : districtsOnAlert > 0 ? 'text-amber-500' : 'text-blue-600'
  const alertBg =
    districtsOnAlert > 3 ? 'bg-red-50' : districtsOnAlert > 0 ? 'bg-amber-50' : 'bg-blue-50'

  const stockColor = kpis.facilitiesWithStockRisk > 5 ? 'text-red-600' : 'text-blue-600'
  const stockBg = kpis.facilitiesWithStockRisk > 5 ? 'bg-red-50' : 'bg-blue-50'

  return (
    <div className="space-y-6">
      {/* Row 1 — Alert banner */}
      <AlertBanner
        alerts={alerts}
        onDismiss={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
      />

      {/* Row 2 — Section header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">National Health Snapshot</h2>
          <p className="text-xs text-muted-foreground">
            {today && `${today} · `}Last updated: just now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Select Disease:</label>
          <Select
            value={selectedDisease}
            onValueChange={(v) => setDisease(v as Disease)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select disease" />
            </SelectTrigger>
            <SelectContent>
              {DISEASES.map((d) => (
                <SelectItem key={d.key} value={d.key}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 3 — KPI grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          title="Facilities Reporting"
          value={kpis.totalFacilitiesReporting}
          subtitle="of 312 expected"
          icon={Building2}
        />
        <KpiCard
          title="Reporting Completeness"
          value={kpis.reportingCompleteness}
          icon={CheckCircle}
          iconColor={complColor}
          iconBg={complBg}
        />
        <KpiCard
          title={`Active ${diseaseLabel} Cases`}
          value={summary.totalCases}
          icon={Activity}
          alert={summary.criticalDistricts > 0}
        />
        <KpiCard
          title="Districts on Alert"
          value={districtsOnAlert}
          subtitle="critical + high"
          icon={AlertTriangle}
          iconColor={alertColor}
          iconBg={alertBg}
        />
        <KpiCard
          title="Avg Bed Occupancy"
          value={`${kpis.avgBedOccupancy}%`}
          icon={Bed}
          alert={kpis.avgBedOccupancy > 85}
        />
        <KpiCard
          title="Stock at Risk"
          value={kpis.facilitiesWithStockRisk}
          subtitle="facilities"
          icon={Package}
          iconColor={stockColor}
          iconBg={stockBg}
        />
      </div>

      {/* Row 4 — Trend + top districts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendChart disease={selectedDisease} height={240} />
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Top Districts This Week
          </h3>
          <ul className="space-y-3">
            {topDistricts.map((d, i) => (
              <li key={d.id} className="flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-gray-900">
                  {d.name}
                </span>
                <span className="text-sm tabular-nums text-gray-600">
                  {d.cases.toLocaleString()}
                </span>
                <span
                  className={`size-2.5 rounded-full ${getSeverityColor(d.severity)}`}
                  title={getSeverityLabel(d.severity)}
                  aria-label={getSeverityLabel(d.severity)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Row 5 — AI brief */}
      <AiBrief disease={selectedDisease} />

      {/* Row 6 — Quick navigation */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-start justify-between gap-3 rounded-xl border bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Map className="size-4" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{link.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
              </div>
            </div>
            <ArrowRight className="size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
          </Link>
        ))}
      </div>
    </div>
  )
}
