'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Activity, Siren, AlertTriangle, Users } from 'lucide-react'
import { AUDIT_LOGS, getFlaggedLogs } from '@/data/audit-logs'
import { AccessLog } from '@/components/patient/access-log'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { Button } from '@/components/ui/button'

export default function AuditPage() {
  const [reviewed, setReviewed] = useState<Set<string>>(new Set())

  const totalEvents = AUDIT_LOGS.length
  const emergencyCount = AUDIT_LOGS.filter(
    (l) => l.action === 'emergency-access'
  ).length
  const uniquePatients = new Set(AUDIT_LOGS.map((l) => l.patientHieId)).size

  const flagged = getFlaggedLogs().filter((l) => !reviewed.has(l.id))

  return (
    <div className="space-y-6">
      {/* Row 1 — header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">System Audit Log</h2>
          <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            Data Protection Officer View
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          All patient record access across the Uganda HIE network
        </p>
      </div>

      {/* Row 2 — KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard title="Total Access Events" value={totalEvents} icon={Activity} />
        <KpiCard
          title="Emergency Accesses"
          value={emergencyCount}
          icon={Siren}
          alert={emergencyCount > 0}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <KpiCard
          title="Flagged for Review"
          value={flagged.length}
          icon={AlertTriangle}
          alert={flagged.length > 0}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <KpiCard
          title="Unique Patients Accessed"
          value={uniquePatients}
          icon={Users}
        />
      </div>

      {/* Row 3 — flagged events */}
      {flagged.length > 0 && (
        <div className="rounded-xl border border-l-4 border-l-red-500 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-red-700">
            ⚠ Requires DPO Review
          </h3>
          <ul className="space-y-2">
            {flagged.map((log) => (
              <li
                key={log.id}
                className="flex flex-col gap-2 rounded-lg border bg-red-50/40 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(log.timestamp), 'd MMM HH:mm')}
                    </span>
                    <span className="font-medium text-gray-900">
                      {log.userName}
                    </span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      {log.action}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {log.patientHieId}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {log.reason}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  onClick={() =>
                    setReviewed((prev) => new Set(prev).add(log.id))
                  }
                >
                  Mark Reviewed
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Row 4 — full audit log */}
      <AccessLog showAll limit={25} title="Full System Audit Trail" />
    </div>
  )
}
