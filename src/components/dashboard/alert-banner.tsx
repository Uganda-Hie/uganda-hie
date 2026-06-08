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

  // Highest severity present drives the banner colour.
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
        'flex items-center gap-3 rounded-xl px-4 py-3 text-white shadow-sm',
        isCritical ? 'bg-red-600' : 'bg-orange-500'
      )}
    >
      <Siren className="size-5 shrink-0 animate-pulse" />
      <span className="shrink-0 text-sm font-semibold">Active Alerts:</span>

      {/* Scrolling pills */}
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
                'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors',
                isSel
                  ? 'bg-white/40 ring-2 ring-white/70'
                  : 'bg-white/20 hover:bg-white/30'
              )}
            >
              <span className="font-semibold">{alert.district}</span>
              <span className="opacity-90">· {alert.disease}</span>
            </button>
          )
        })}
      </div>

      {/* Selected alert message (when a pill is highlighted) */}
      {selectedAlert && (
        <span className="hidden shrink-0 max-w-xs truncate text-xs opacity-90 lg:inline">
          {selectedAlert.message}
        </span>
      )}

      {/* Dismiss */}
      <button
        type="button"
        onClick={dismissAll}
        aria-label="Dismiss all alerts"
        className="shrink-0 rounded-md p-1 transition-colors hover:bg-white/20"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
