'use client'

import { useState } from 'react'
import { Siren, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DashboardAlert {
  id: string
  district: string
  disease: string
  severity: 'critical' | 'high'
  message: string
}

interface AlertBannerProps {
  alerts: DashboardAlert[]
  onDismiss?: (id: string) => void
}

export function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)

  const visible = alerts.filter((a) => !dismissed.has(a.id))
  if (visible.length === 0) return null

  const isCritical = visible.some((a) => a.severity === 'critical')

  function dismissOne(id: string) {
    setDismissed((prev) => new Set(prev).add(id))
    if (selected === id) setSelected(null)
    onDismiss?.(id)
  }
  function dismissAll() {
    visible.forEach((a) => dismissOne(a.id))
  }

  const selectedAlert = visible.find((a) => a.id === selected)

  return (
    <div
      role="alert"
      className={cn(
        'flex items-center gap-3 rounded-xl border px-4 py-3 text-[#f7f8f8]',
        isCritical
          ? 'border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.1)]'
          : 'border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.1)]'
      )}
    >
      <Siren
        className={cn(
          'size-5 shrink-0 animate-pulse',
          isCritical ? 'text-[#dc2626]' : 'text-[#f97316]'
        )}
      />
      <span className="shrink-0 text-sm font-[510]">Active Alerts:</span>

      <div className="flex flex-1 items-center gap-2 overflow-x-auto">
        {visible.map((alert) => {
          const isSel = alert.id === selected
          return (
            <button
              key={alert.id}
              type="button"
              onClick={() => setSelected(isSel ? null : alert.id)}
              title={alert.message}
              className={cn(
                'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium text-[#d0d6e0] transition-colors',
                isSel ? 'bg-white/15 ring-1 ring-white/30' : 'bg-white/8 hover:bg-white/12'
              )}
            >
              <span className="font-[510] text-[#f7f8f8]">{alert.district}</span>
              <span className="opacity-80">· {alert.disease}</span>
            </button>
          )
        })}
      </div>

      {selectedAlert && (
        <span className="hidden max-w-xs shrink-0 truncate text-xs text-[#8a8f98] lg:inline">
          {selectedAlert.message}
        </span>
      )}

      <button
        type="button"
        onClick={dismissAll}
        aria-label="Dismiss all alerts"
        className="shrink-0 rounded-md p-1 text-[#8a8f98] transition-colors hover:bg-white/8 hover:text-[#f7f8f8]"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
