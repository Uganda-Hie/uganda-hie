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
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  queried: 'bg-purple-100 text-purple-700',
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
        'overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow',
        onClick && 'cursor-pointer hover:shadow-md',
        selected && 'border-l-4 border-l-blue-500'
      )}
    >
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">{claim.id}</p>
            <p className="truncate font-semibold text-gray-900">
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
            <span className="text-sm font-medium text-gray-800">
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
          <span className="font-bold text-blue-600">
            {formatUGX(claim.amountUGX)}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(claim.submittedAt)}
            </span>
            {onClick && (
              <ChevronRight className="size-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Rejection banner */}
      {claim.status === 'rejected' && claim.rejectionReason && (
        <div className="bg-red-50 px-4 py-2 text-xs text-red-700">
          Reason: {claim.rejectionReason}
        </div>
      )}
    </div>
  )
}
