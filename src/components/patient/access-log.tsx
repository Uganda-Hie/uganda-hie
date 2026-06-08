'use client'

import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Shield, AlertTriangle } from 'lucide-react'
import { AUDIT_LOGS, type AuditLog } from '@/data/audit-logs'
import { EmptyState } from '@/components/dashboard/empty-state'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface AccessLogProps {
  patientHieId?: string
  showAll?: boolean
  limit?: number
  title?: string
}

const ACTION_BADGE: Record<AuditLog['action'], string> = {
  view: 'bg-blue-100 text-blue-700',
  'emergency-access': 'bg-red-100 text-red-700 font-bold',
  share: 'bg-green-100 text-green-700',
  revoke: 'bg-orange-100 text-orange-700',
  download: 'bg-purple-100 text-purple-700',
}

const ACTION_FILTERS: Array<AuditLog['action'] | 'all'> = [
  'all',
  'view',
  'emergency-access',
  'share',
  'revoke',
  'download',
]

function truncate(s: string, n = 40): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

export function AccessLog({
  patientHieId,
  showAll = false,
  limit = 10,
  title = 'Access History',
}: AccessLogProps) {
  const [actionFilter, setActionFilter] = useState<AuditLog['action'] | 'all'>(
    'all'
  )
  const [visibleCount, setVisibleCount] = useState(limit)

  // Reset pagination when filter or patient changes.
  useEffect(() => {
    setVisibleCount(limit)
  }, [actionFilter, patientHieId, limit])

  const base = patientHieId
    ? AUDIT_LOGS.filter((l) => l.patientHieId === patientHieId)
    : AUDIT_LOGS

  const filtered = base
    .filter((l) => (showAll && actionFilter !== 'all' ? l.action === actionFilter : true))
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  const visible = filtered.slice(0, visibleCount)
  const emergencyCount = filtered.filter((l) => l.action === 'emergency-access').length
  const flaggedCount = filtered.filter((l) => l.flagged).length

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Shield className="size-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Action filters (admin) */}
      {showAll && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {ACTION_FILTERS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setActionFilter(a)}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors',
                actionFilter === a
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {a === 'all' ? 'All' : a.replace('-', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      {visible.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Timestamp</th>
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Action</th>
                {showAll && <th className="pb-2 font-medium">Patient</th>}
                <th className="pb-2 font-medium">Reason</th>
                <th className="pb-2 font-medium">Flag</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((log) => (
                <tr key={log.id} className="border-b last:border-0 align-top">
                  <td className="py-2 whitespace-nowrap">
                    <div className="text-gray-700">{formatDate(log.timestamp)}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(parseISO(log.timestamp), 'HH:mm')}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="font-medium text-gray-700">{log.userName}</div>
                    <div className="text-xs text-muted-foreground">{log.userRole}</div>
                  </td>
                  <td className="py-2">
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-xs',
                        ACTION_BADGE[log.action]
                      )}
                    >
                      {log.action}
                    </span>
                  </td>
                  {showAll && (
                    <td className="py-2 font-mono text-xs text-muted-foreground">
                      {log.patientHieId}
                    </td>
                  )}
                  <td className="py-2 text-xs text-muted-foreground" title={log.reason}>
                    {truncate(log.reason)}
                  </td>
                  <td className="py-2">
                    {log.flagged && (
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        <AlertTriangle className="size-3" />
                        Review Required
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={Shield}
          title="No access history"
          subtitle={
            patientHieId
              ? 'No access events recorded for this patient yet.'
              : 'No access events recorded yet.'
          }
        />
      )}

      {/* Show more */}
      {visibleCount < filtered.length && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleCount((c) => c + limit)}
          >
            Show more ({filtered.length - visibleCount} remaining)
          </Button>
        </div>
      )}

      {/* Summary */}
      <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
        <span className="font-medium text-gray-700">{filtered.length}</span> total
        accesses ·{' '}
        <span className="font-medium text-red-600">{emergencyCount}</span> emergency
        ·{' '}
        <span className="font-medium text-amber-600">{flaggedCount}</span> flagged
        for review
      </p>
    </div>
  )
}
