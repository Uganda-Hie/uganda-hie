import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400',
        className
      )}
    >
      <AlertTriangle className="size-3.5 shrink-0" aria-hidden />
      Demo Data Only — BoU@60 Hackathon
    </span>
  )
}
