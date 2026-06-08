'use client'

import { useMemo } from 'react'
import { DISTRICTS, generateDistrictMetrics } from '@/data/districts'
import { getSeverityColor, getSeverityLabel } from '@/lib/severity'
import { formatPercent } from '@/lib/utils'
import type { DiseaseKey } from '@/types/disease'
import type { DistrictMetric } from '@/types/district'
import { cn } from '@/lib/utils'

interface DistrictTooltipProps {
  districtId: string | null
  disease: DiseaseKey
  x: number
  y: number
  visible: boolean
}

const STOCK_RISK_COLOR: Record<DistrictMetric['stockRisk'], string> = {
  ok: 'text-green-400',
  watch: 'text-yellow-600',
  high: 'text-orange-400',
  critical: 'text-red-600',
}

export function DistrictTooltip({
  districtId,
  disease,
  x,
  y,
  visible,
}: DistrictTooltipProps) {
  const metrics = useMemo(() => generateDistrictMetrics(disease), [disease])

  const district = districtId
    ? DISTRICTS.find((d) => d.id === districtId)
    : undefined
  const metric = districtId
    ? metrics.find((m) => m.districtId === districtId)
    : undefined

  const show = visible && !!district && !!metric

  return (
    <div
      className={cn(
        'pointer-events-none fixed z-50 w-56 rounded-lg border bg-card p-3 text-xs shadow-lg transition-opacity duration-150',
        show ? 'opacity-100' : 'opacity-0'
      )}
      style={{ left: x + 12, top: y - 10 }}
      role="tooltip"
      aria-hidden={!show}
    >
      {district && metric && (
        <>
          <div className="font-semibold text-foreground">{district.name}</div>
          <div className="text-muted-foreground">{district.region} Region</div>

          <div className="my-2 h-px bg-border" />

          <dl className="space-y-1">
            <Row label="Cases" value={metric.cases.toLocaleString()} />
            <Row
              label="Incidence /100k"
              value={metric.incidencePer100k.toLocaleString()}
            />
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Week-on-week</dt>
              <dd
                className={cn(
                  'font-medium',
                  metric.weekOnWeekChange > 0
                    ? 'text-red-600'
                    : metric.weekOnWeekChange < 0
                      ? 'text-green-400'
                      : 'text-muted-foreground'
                )}
              >
                {formatPercent(metric.weekOnWeekChange)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Severity</dt>
              <dd>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium text-white',
                    getSeverityColor(metric.severity)
                  )}
                >
                  {getSeverityLabel(metric.severity)}
                </span>
              </dd>
            </div>
            <Row label="Bed occupancy" value={`${metric.bedOccupancy}%`} />
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Stock risk</dt>
              <dd
                className={cn(
                  'font-medium capitalize',
                  STOCK_RISK_COLOR[metric.stockRisk]
                )}
              >
                {metric.stockRisk}
              </dd>
            </div>
          </dl>
        </>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground tabular-nums">{value}</dd>
    </div>
  )
}
