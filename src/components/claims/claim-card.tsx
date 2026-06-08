import { ChevronRight } from 'lucide-react'
import type { Claim } from '@/types/claim'
import { formatUGX, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ClaimCardProps {
  claim: Claim
  onClick?: () => void
  selected?: boolean
}

const STATUS_BADGE: Record<Claim['status'], string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  approved: 'bg-green-500/15 text-green-400',
  rejected: 'bg-red-500/15 text-red-400',
  queried: 'bg-purple-500/15 text-purple-400',
}

export function ClaimCard({ claim, onClick, selected = false }: ClaimCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn(
        'overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow',
        onClick && 'cursor-pointer hover:shadow-md',
        selected && 'border-l-4 border-l-blue-500'
      )}
    >
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">{claim.id}</p>
            <p className="truncate font-semibold text-foreground">
              {claim.facilityName}
            </p>
          </div>
          <span
            className={cn(
              'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
              STATUS_BADGE[claim.status]
            )}
          >
            {claim.status}
          </span>
        </div>

        {/* Middle row */}
        <div className="mt-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-medium text-foreground">
              {claim.diagnosis}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {claim.procedureCode}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{claim.insurer}</p>
        </div>

        {/* Bottom row */}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-blue-400">
            {formatUGX(claim.amountUGX)}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(claim.submittedAt)}
            </span>
            {onClick && (
              <ChevronRight className="size-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Rejection banner */}
      {claim.status === 'rejected' && claim.rejectionReason && (
        <div className="bg-red-500/10 px-4 py-2 text-xs text-red-400">
          Reason: {claim.rejectionReason}
        </div>
      )}
    </div>
  )
}
