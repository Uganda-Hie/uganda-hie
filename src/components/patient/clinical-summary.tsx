'use client'

import { format, parseISO } from 'date-fns'
import { Activity, Pill, ArrowRight, AlertTriangle, FlaskConical, Shield } from 'lucide-react'
import { EmptyState } from '@/components/dashboard/empty-state'
import type { Patient } from '@/types/patient'
import { AUDIT_LOGS } from '@/data/audit-logs'
import { getFacilityById } from '@/data/facilities'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface ClinicalSummaryProps {
  patient: Patient
  emergencyMode?: boolean
}

function resultClass(result: string): string {
  if (/positive|detected/i.test(result)) return 'text-red-600 font-medium'
  if (/low|high|poorly/i.test(result)) return 'text-amber-400 font-medium'
  if (/normal|negative|undetectable/i.test(result))
    return 'text-green-400 font-medium'
  return 'text-foreground'
}

const REFERRAL_STATUS: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  completed: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-muted text-muted-foreground',
}

export function ClinicalSummary({
  patient,
  emergencyMode = false,
}: ClinicalSummaryProps) {
  const labs = [...patient.labResults].sort((a, b) =>
    b.date.localeCompare(a.date)
  )
  const accessLogs = AUDIT_LOGS.filter((l) => l.patientHieId === patient.hieId)

  return (
    <Tabs defaultValue="conditions" className="w-full">
      <TabsList className="flex-wrap">
        <TabsTrigger value="conditions">Active Conditions &amp; Medications</TabsTrigger>
        <TabsTrigger value="labs">Lab Results</TabsTrigger>
        <TabsTrigger value="referrals">Referral History</TabsTrigger>
        <TabsTrigger value="access">Access Log</TabsTrigger>
      </TabsList>

      {/* Tab 1 — Conditions & Medications */}
      <TabsContent value="conditions" className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Current Conditions
            </h3>
            <ul className="space-y-2">
              {patient.conditions.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-foreground">
                  <Activity className="size-4 shrink-0 text-blue-400" />
                  {c}
                </li>
              ))}
              {patient.conditions.length === 0 && (
                <li className="text-sm text-muted-foreground">None recorded</li>
              )}
            </ul>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Current Medications
            </h3>
            <ul className="space-y-2">
              {patient.medications.map((m) => (
                <li key={m} className="flex items-center gap-2 text-sm text-foreground">
                  <Pill className="size-4 shrink-0 text-violet-400" />
                  {m}
                </li>
              ))}
              {patient.medications.length === 0 && (
                <li className="text-sm text-muted-foreground">None recorded</li>
              )}
            </ul>
          </div>
        </div>

        {emergencyMode && (
          <div className="rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
            Verify current medications before administering any treatment — this
            record may not reflect medications from the last 48 hours.
          </div>
        )}
      </TabsContent>

      {/* Tab 2 — Lab Results */}
      <TabsContent value="labs">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          {labs.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Test</th>
                  <th className="pb-2 font-medium">Result</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Facility</th>
                </tr>
              </thead>
              <tbody>
                {labs.map((lab, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 text-foreground">{lab.test}</td>
                    <td className={cn('py-2', resultClass(lab.result))}>
                      {lab.result}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {formatDate(lab.date)}
                    </td>
                    <td className="py-2 text-muted-foreground">{lab.facility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              icon={FlaskConical}
              title="No lab results on record"
              subtitle="Lab results appear here once tests are recorded."
            />
          )}
        </div>
      </TabsContent>

      {/* Tab 3 — Referral History */}
      <TabsContent value="referrals">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          {patient.referrals.length > 0 ? (
            <ul className="space-y-4">
              {patient.referrals.map((r, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-20 shrink-0 text-xs text-muted-foreground">
                    {formatDate(r.date)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      {r.from}
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                      {r.to}
                    </div>
                    <div className="text-xs text-muted-foreground">{r.reason}</div>
                  </div>
                  <span
                    className={cn(
                      'h-fit rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                      REFERRAL_STATUS[r.status] ?? 'bg-muted text-muted-foreground'
                    )}
                  >
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={ArrowRight}
              title="No referral history"
              subtitle="This patient has no recorded referrals."
            />
          )}
        </div>
      </TabsContent>

      {/* Tab 4 — Access Log */}
      <TabsContent value="access">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          {accessLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Timestamp</th>
                    <th className="pb-2 font-medium">User</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">Facility</th>
                    <th className="pb-2 font-medium">Action</th>
                    <th className="pb-2 font-medium">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {accessLogs.map((log) => (
                    <tr key={log.id} className="border-b last:border-0">
                      <td className="py-2 whitespace-nowrap text-muted-foreground">
                        {format(parseISO(log.timestamp), 'd MMM HH:mm')}
                      </td>
                      <td className="py-2 text-foreground">
                        <span className="flex items-center gap-1">
                          {log.flagged && (
                            <AlertTriangle className="size-3.5 shrink-0 text-red-500" />
                          )}
                          {log.userName}
                        </span>
                      </td>
                      <td className="py-2 text-muted-foreground">{log.userRole}</td>
                      <td className="py-2 text-muted-foreground">
                        {getFacilityById(log.facilityId)?.name ?? log.facilityId}
                      </td>
                      <td className="py-2">
                        <span
                          className={cn(
                            'rounded px-1.5 py-0.5 text-xs font-medium',
                            log.action === 'emergency-access'
                              ? 'bg-red-500/15 text-red-400'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2 text-xs text-muted-foreground">
                        {log.reason}
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
              subtitle="No one has accessed this patient's record yet."
            />
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
