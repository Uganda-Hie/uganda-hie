'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sparkles, ShieldAlert, Siren, RefreshCw } from 'lucide-react'
import {
  generateAIBrief,
  generateStockAlert,
  generateOutbreakFlag,
} from '@/lib/ai-insights'
import { useDemoStore } from '@/store/demo-store'
import type { DiseaseKey } from '@/types/disease'
import { cn } from '@/lib/utils'

interface AiBriefProps {
  disease: DiseaseKey
}

export function AiBrief({ disease }: AiBriefProps) {
  // Prop is the source of truth; fall back to the global selected disease.
  const selectedDisease = useDemoStore((s) => s.selectedDisease)
  const active = disease ?? selectedDisease

  const brief = useMemo(() => generateAIBrief(active), [active])
  const stockAlert = useMemo(() => generateStockAlert(active), [active])
  const outbreak = useMemo(() => generateOutbreakFlag(active), [active])

  const words = useMemo(() => brief.split(' '), [brief])
  const [count, setCount] = useState(0)
  const [replay, setReplay] = useState(0)

  // Typewriter: reveal one word every 40ms; re-runs on disease change or refresh.
  useEffect(() => {
    setCount(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setCount(i)
      if (i >= words.length) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [words, replay])

  const typing = count < words.length
  const shown = words.slice(0, count).join(' ')

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-violet-50">
            <Sparkles className="size-4 text-violet-600" />
          </span>
          <h3 className="text-sm font-semibold text-gray-900">
            AI Executive Brief
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 sm:inline">
            Powered by HIE Analytics
          </span>
          <button
            type="button"
            onClick={() => setReplay((r) => r + 1)}
            aria-label="Regenerate brief"
            title="Regenerate"
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <RefreshCw className={cn('size-4', typing && 'animate-spin')} />
          </button>
        </div>
      </div>

      <div className="my-4 h-px bg-border" />

      {/* Brief text with typewriter cursor */}
      <p className="min-h-16 text-sm leading-relaxed text-gray-700">
        {shown}
        {typing && (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-violet-500 align-middle" />
        )}
      </p>

      {/* Stock alert */}
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <span>{stockAlert}</span>
      </div>

      {/* Outbreak flag (only if present) */}
      {outbreak && (
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
          <Siren className="mt-0.5 size-4 shrink-0 text-red-600" />
          <span>{outbreak}</span>
        </div>
      )}

      {/* Footer */}
      <p className="mt-4 text-xs text-muted-foreground">
        Generated from live facility reports — human review required before
        action.
      </p>
    </div>
  )
}
