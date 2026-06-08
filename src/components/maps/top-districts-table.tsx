'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { getTopDistricts } from '@/data/districts'
import { getSeverityHex, getSeverityLabel } from '@/lib/severity'
import { formatPercent } from '@/lib/utils'
import { DISEASES, type DiseaseKey } from '@/types/disease'
import { cn } from '@/lib/utils'

interface TopDistrictsTableProps {
  disease: DiseaseKey
  onDistrictClick?: (districtId: string) => void
}

export function TopDistrictsTable({
  disease,
  onDistrictClick,
}: TopDistrictsTableProps) {
  const [selected, setSelected] = useState<string | null>(null)

  // All districts (sorted by cases) — slice 10 for the list, full set for counts.
  const all = useMemo(() => getTopDistricts(disease, 1000), [disease])
  const top10 = all.slice(0, 10)

  const diseaseLabel =
    DISEASES.find((d) => d.key === disease)?.label ?? disease

  const criticalCount = all.filter((d) => d.severity === 'critical').length
  const highCount = all.filter((d) => d.severity === 'high').length
  const missingCount = all.filter((d) => !d.reportingComplete).length

  function handleClick(id: string) {
    setSelected(id)
    onDistrictClick?.(id)
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Top Districts</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {diseaseLabel}
        </span>
      </div>

      {/* List */}
      <ul className="flex-1 divide-y overflow-y-auto">
        {top10.map((d, i) => {
          const positive = d.weekOnWeekChange > 0
          const atRisk = d.stockRisk === 'critical' || d.stockRisk === 'high'
          return (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => handleClick(d.id)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted',
                  selected === d.id && 'bg-blue-500/10'
                )}
              >
                <span className="w-6 shrink-0 text-sm font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: getSeverityHex(d.severity) }}
                  title={getSeverityLabel(d.severity)}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {d.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {d.region}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-bold tabular-nums text-foreground">
                    {d.cases.toLocaleString()}
                  </span>
                  <span
                    className={cn(
                      'block text-xs tabular-nums',
                      positive
                        ? 'text-red-600'
                        : d.weekOnWeekChange < 0
                          ? 'text-green-400'
                          : 'text-muted-foreground'
                    )}
                  >
                    {formatPercent(d.weekOnWeekChange)}
                  </span>
                </span>
                {atRisk ? (
                  <AlertTriangle
                    className="size-4 shrink-0 text-red-500"
                    aria-label="Stock at risk"
                  />
                ) : (
                  <CheckCircle
                    className="size-4 shrink-0 text-green-500"
                    aria-label="Stock OK"
                  />
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {/* Summary */}
      <div className="border-t px-4 py-2.5 text-xs text-muted-foreground">
        <span className="font-medium text-red-600">{criticalCount} critical</span>
        {' · '}
        <span className="font-medium text-orange-500">{highCount} high</span>
        {' · '}
        <span className="font-medium text-muted-foreground">
          {missingCount} missing reports
        </span>
      </div>
    </div>
  )
}
