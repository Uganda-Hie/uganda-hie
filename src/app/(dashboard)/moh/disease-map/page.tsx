'use client'

import { useMemo, useState } from 'react'
import { Loader2, Map as MapIcon } from 'lucide-react'
import { UgandaMap } from '@/components/maps/uganda-map'
import { TopDistrictsTable } from '@/components/maps/top-districts-table'
import { SeverityLegend } from '@/components/maps/severity-legend'
import { DistrictTooltip } from '@/components/maps/district-tooltip'
import { AiBrief } from '@/components/dashboard/ai-brief'
import { useDemoStore } from '@/store/demo-store'
import { DISEASES } from '@/types/disease'
import type { Disease, TimeRange } from '@/store/demo-store'
import { DISTRICTS, generateDistrictMetrics } from '@/data/districts'
import { getSeverityColor, getSeverityLabel } from '@/lib/severity'
import { formatPercent } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: 'quarter', label: 'Quarter' },
]

export default function DiseaseMapPage() {
  const selectedDisease = useDemoStore((s) => s.selectedDisease)
  const setDisease = useDemoStore((s) => s.setDisease)
  const selectedTimeRange = useDemoStore((s) => s.selectedTimeRange)
  const setTimeRange = useDemoStore((s) => s.setTimeRange)

  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)
  const [tooltipX, setTooltipX] = useState(0)
  const [tooltipY, setTooltipY] = useState(0)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [mapVisible, setMapVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleShowOnMap() {
    setLoading(true)
    setTimeout(() => {
      setMapVisible(true)
      setLoading(false)
    }, 800)
  }

  // Selected district detail (district + its metric for the current disease).
  const selectedInfo = useMemo(() => {
    if (!selectedDistrict) return null
    const district = DISTRICTS.find((d) => d.id === selectedDistrict)
    const metric = generateDistrictMetrics(selectedDisease).find(
      (m) => m.districtId === selectedDistrict
    )
    if (!district || !metric) return null
    return { district, metric }
  }, [selectedDistrict, selectedDisease])

  return (
    <div className="space-y-6">
      {/* Row 1 — header + controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Disease Intelligence</h2>
          <p className="text-sm text-muted-foreground">
            Select a disease and click Show on Map to view district severity
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedDisease}
            onValueChange={(v) => setDisease(v as Disease)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Disease" />
            </SelectTrigger>
            <SelectContent>
              {DISEASES.map((d) => (
                <SelectItem key={d.key} value={d.key}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTimeRange}
            onValueChange={(v) => setTimeRange(v as TimeRange)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleShowOnMap} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Loading…
              </>
            ) : (
              'Show on Map'
            )}
          </Button>
        </div>
      </div>

      {/* Row 2 — map + right panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left — map */}
        <div>
          {mapVisible ? (
            <div className="space-y-4">
              <UgandaMap
                disease={selectedDisease}
                selectedDistrictId={selectedDistrict}
                onDistrictHover={(id, x, y) => {
                  setHoveredDistrict(id)
                  setTooltipX(x)
                  setTooltipY(y)
                }}
                onDistrictClick={(id) => setSelectedDistrict(id)}
              />
              <SeverityLegend />
            </div>
          ) : (
            <div className="flex h-[520px] flex-col items-center justify-center rounded-xl border border-dashed bg-gray-50 text-center">
              <MapIcon className="size-12 text-gray-300" />
              <p className="mt-3 text-sm text-muted-foreground">
                Select a disease and click Show on Map
              </p>
            </div>
          )}
        </div>

        {/* Right — top districts + selected */}
        <div className="flex flex-col gap-4">
          <div className="h-[400px]">
            <TopDistrictsTable
              disease={selectedDisease}
              onDistrictClick={(id) => setSelectedDistrict(id)}
            />
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Selected District
            </h3>
            {selectedInfo ? (
              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-semibold text-gray-900">
                    {selectedInfo.district.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedInfo.district.region} Region
                  </div>
                </div>
                <Stat label="Cases" value={selectedInfo.metric.cases.toLocaleString()} />
                <Stat
                  label="Incidence /100k"
                  value={selectedInfo.metric.incidencePer100k.toLocaleString()}
                />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Week-on-week</span>
                  <span
                    className={
                      selectedInfo.metric.weekOnWeekChange > 0
                        ? 'font-medium text-red-600'
                        : selectedInfo.metric.weekOnWeekChange < 0
                          ? 'font-medium text-green-600'
                          : 'font-medium text-gray-600'
                    }
                  >
                    {formatPercent(selectedInfo.metric.weekOnWeekChange)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Severity</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${getSeverityColor(
                      selectedInfo.metric.severity
                    )}`}
                  >
                    {getSeverityLabel(selectedInfo.metric.severity)}
                  </span>
                </div>
                <Stat
                  label="Bed occupancy"
                  value={`${selectedInfo.metric.bedOccupancy}%`}
                />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Stock risk</span>
                  <span className="font-medium capitalize text-gray-900">
                    {selectedInfo.metric.stockRisk}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click a district on the map for details
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Row 3 — AI brief */}
      <AiBrief disease={selectedDisease} />

      {/* Floating tooltip */}
      <DistrictTooltip
        districtId={hoveredDistrict}
        disease={selectedDisease}
        x={tooltipX}
        y={tooltipY}
        visible={hoveredDistrict !== null}
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums text-gray-900">{value}</span>
    </div>
  )
}
