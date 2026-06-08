'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format, parseISO, addHours } from 'date-fns'
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react'
import { getPatientById } from '@/data/patients'
import { PatientCard } from '@/components/patient/patient-card'
import { ClinicalSummary } from '@/components/patient/clinical-summary'
import { EmergencyModal } from '@/components/patient/emergency-modal'
import { AUDIT_LOGS, type AuditLog } from '@/data/audit-logs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export default function PatientRecordPage() {
  const params = useParams()
  const router = useRouter()
  const id = String(params.id)
  const patient = getPatientById(id)

  const [emergencyMode, setEmergencyMode] = useState(false)
  const [emergencyReason, setEmergencyReason] = useState('')
  const [accessedAt, setAccessedAt] = useState('')
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  if (!patient) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-16 text-center">
        <p className="text-lg font-medium text-gray-900">Patient not found</p>
        <p className="text-sm text-muted-foreground">
          No record matches “{id}”.
        </p>
        <Button variant="outline" onClick={() => router.push('/doctor')}>
          <ArrowLeft className="size-4" /> Back to search
        </Button>
      </div>
    )
  }

  const consentFull = patient.consentStatus === 'full'
  const hasAccess = consentFull || accessGranted

  function handleEmergencyConfirm(reason: string) {
    if (!patient) return
    const now = new Date().toISOString()
    setEmergencyMode(true)
    setEmergencyReason(reason)
    setAccessedAt(now)
    setAccessGranted(true)
    setShowEmergencyModal(false)

    // Record the break-glass access to the audit trail.
    const entry: AuditLog = {
      id: `AUD-LIVE-${now}`,
      userId: 'u-doc-01',
      userName: 'Dr. Ssemakula Paul',
      userRole: 'Clinical Officer',
      patientHieId: patient.hieId,
      action: 'emergency-access',
      facilityId: 'f001',
      timestamp: now,
      reason,
      flagged: false,
    }
    if (!AUDIT_LOGS.some((l) => l.id === entry.id)) AUDIT_LOGS.unshift(entry)
  }

  const revokeTime = accessedAt
    ? format(addHours(parseISO(accessedAt), 2), 'HH:mm')
    : ''

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        type="button"
        onClick={() => router.push('/doctor')}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gray-900"
      >
        <ArrowLeft className="size-4" /> Back to search
      </button>

      {/* Emergency banner */}
      {emergencyMode && (
        <div className="sticky top-0 z-10 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">
          EMERGENCY ACCESS ACTIVE · Session logged · Reason:{' '}
          {emergencyReason.length > 60
            ? emergencyReason.slice(0, 60) + '…'
            : emergencyReason}{' '}
          · Auto-revokes: {revokeTime}
        </div>
      )}

      {hasAccess ? (
        <>
          <PatientCard
            patient={patient}
            emergencyMode={emergencyMode}
            accessedAt={accessedAt}
          />
          <ClinicalSummary patient={patient} emergencyMode={emergencyMode} />

          <div className="flex justify-end border-t pt-4">
            <Button variant="outline" onClick={() => setShowEndConfirm(true)}>
              End Session
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Minimal identity header */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
            <p className="font-mono text-xs text-muted-foreground">
              {patient.hieId}
            </p>
          </div>

          {/* Locked clinical content */}
          <div className="relative">
            <div className="pointer-events-none select-none blur-sm">
              <ClinicalSummary patient={patient} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gray-100/60">
              <div className="max-w-sm rounded-xl border bg-white p-6 text-center shadow-lg">
                <Lock className="mx-auto size-8 text-gray-400" />
                <p className="mt-3 text-sm font-medium text-gray-900">
                  Patient has not granted general access to their record
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Consent status: {patient.consentStatus}
                </p>
                <Button
                  variant="destructive"
                  className="mt-4"
                  onClick={() => setShowEmergencyModal(true)}
                >
                  <ShieldAlert className="size-4" /> Request Emergency Access
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Emergency access modal */}
      <EmergencyModal
        open={showEmergencyModal}
        onConfirm={handleEmergencyConfirm}
        onCancel={() => setShowEmergencyModal(false)}
      />

      {/* End session confirmation */}
      <Dialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>End session?</DialogTitle>
            <DialogDescription>
              Access will be revoked and the session finalized in the audit log.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => router.push('/doctor')}>
              End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
