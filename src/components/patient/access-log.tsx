'use client'

import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Shield, AlertTriangle } from 'lucide-react'
import { AUDIT_LOGS, type AuditLog } from '@/data/audit-logs'
import { EmptyState } from '@/components/dashboard/empty-state'
import { getFacilityById } from '@/data/facilities'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'

export type AuditFilter =
  | 'all'
  | 'emergency-access'
  | 'download'
  | 'review-required'

interface AccessLogProps {
  patientHieId?: string
  showAll?: boolean
  limit?: number
  title?: string
  /** Externally-controlled filter (e.g. from the DPO audit page filter bar). */
  actionFilter?: AuditFilter
}

const ACTION_BADGE: Record<AuditLog['action'], string> = {
  view: 'bg-blue-500/15 text-blue-400',
  'emergency-access': 'bg-red-500/15 text-red-400 font-bold',
  share: 'bg-green-500/15 text-green-400',
  revoke: 'bg-orange-500/15 text-orange-400',
  download: 'bg-purple-500/15 text-purple-400',
}

// Severity classification per action.
type Severity = 'critical' | 'warning' | 'info'
const ACTION_SEVERITY: Record<AuditLog['action'], Severity> = {
  'emergency-access': 'critical',
  download: 'warning',
  revoke: 'warning',
  share: 'info',
  view: 'info',
}
const SEVERITY_DOT: Record<Severity, string> = {
  critical: 'bg-red-500',
  warning: 'bg-amber-400',
  info: 'bg-blue-400',
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
  actionFilter: externalFilter,
}: AccessLogProps) {
  const [actionFilter, setActionFilter] = useState<AuditLog['action'] | 'all'>(
    'all'
  )
  const [visibleCount, setVisibleCount] = useState(limit)

  // Review-drawer state.
  const [selected, setSelected] = useState<AuditLog | null>(null)
  const [reviewed, setReviewed] = useState<Set<string>>(new Set())
  const [escalated, setEscalated] = useState<Set<string>>(new Set())

  const controlled = externalFilter !== undefined

  // Reset pagination when filter or patient changes.
  useEffect(() => {
    setVisibleCount(limit)
  }, [actionFilter, externalFilter, patientHieId, limit])

  const base = patientHieId
    ? AUDIT_LOGS.filter((l) => l.patientHieId === patientHieId)
    : AUDIT_LOGS

  const filtered = base
    .filter((l) => {
      if (controlled) {
        if (externalFilter === 'all') return true
        if (externalFilter === 'review-required') return l.flagged
        return l.action === externalFilter
      }
      return showAll && actionFilter !== 'all' ? l.action === actionFilter : true
    })
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  const visible = filtered.slice(0, visibleCount)
  const emergencyCount = filtered.filter((l) => l.action === 'emergency-access').length
  const flaggedCount = filtered.filter((l) => l.flagged).length

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Shield className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      {/* Action filters (admin, uncontrolled only) */}
      {showAll && !controlled && (
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
                  : 'bg-muted text-muted-foreground hover:bg-muted'
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
              {visible.map((log) => {
                const severity = ACTION_SEVERITY[log.action]
                const isReviewed = reviewed.has(log.id)
                const isEscalated = escalated.has(log.id)
                return (
                  <tr
                    key={log.id}
                    onClick={() => log.flagged && setSelected(log)}
                    className={cn(
                      'border-b last:border-0 align-top',
                      log.flagged && 'cursor-pointer hover:bg-muted/50'
                    )}
                  >
                    <td className="py-2 whitespace-nowrap">
                      <div className="text-foreground">{formatDate(log.timestamp)}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(log.timestamp), 'HH:mm')}
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="font-medium text-foreground">{log.userName}</div>
                      <div className="text-xs text-muted-foreground">{log.userRole}</div>
                    </td>
                    <td className="py-2">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'size-1.5 shrink-0 rounded-full',
                            SEVERITY_DOT[severity]
                          )}
                          title={`${severity} severity`}
                        />
                        <span
                          className={cn(
                            'rounded px-1.5 py-0.5 text-xs',
                            ACTION_BADGE[log.action]
                          )}
                        >
                          {log.action}
                        </span>
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
                      {isReviewed ? (
                        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-400">
                          Reviewed
                        </span>
                      ) : log.flagged ? (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium',
                            isEscalated
                              ? 'bg-red-600 text-white'
                              : 'bg-red-500/15 text-red-400'
                          )}
                        >
                          <AlertTriangle className="size-3" />
                          {isEscalated ? 'Escalated' : 'Review Required'}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
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
        <span className="font-medium text-foreground">{filtered.length}</span> total
        accesses ·{' '}
        <span className="font-medium text-red-600">{emergencyCount}</span> emergency
        ·{' '}
        <span className="font-medium text-amber-400">{flaggedCount}</span> flagged
        for review
      </p>

      {/* Review drawer */}
      <Sheet open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-red-500" />
                  Flagged Access Review
                </SheetTitle>
                <SheetDescription>
                  Review this access event and record a DPO decision.
                </SheetDescription>
              </SheetHeader>

              <dl className="space-y-3 text-sm">
                <DrawerRow label="Timestamp" value={format(parseISO(selected.timestamp), 'd MMM yyyy, HH:mm')} />
                <DrawerRow label="User" value={selected.userName} />
                <DrawerRow label="Role" value={selected.userRole} />
                <DrawerRow
                  label="Facility"
                  value={getFacilityById(selected.facilityId)?.name ?? selected.facilityId}
                />
                <DrawerRow label="Action" value={selected.action} />
                <DrawerRow label="Reason" value={selected.reason} />
                {escalated.has(selected.id) && (
                  <div className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                    ⚠ Escalated — flagged for senior DPO investigation
                  </div>
                )}
              </dl>

              <SheetFooter className="sm:flex-row">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setReviewed((prev) => new Set(prev).add(selected.id))
                    setSelected(null)
                  }}
                >
                  Mark Reviewed
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() =>
                    setEscalated((prev) => new Set(prev).add(selected.id))
                  }
                >
                  Escalate
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function DrawerRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-foreground capitalize">{value}</dd>
    </div>
  )
}
