'use client'

import { useEffect, useState } from 'react'
import { FileText, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import type { Claim } from '@/types/claim'
import { getPatientById } from '@/data/patients'
import { getFacilityById } from '@/data/facilities'
import { formatUGX, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

interface ClaimDetailProps {
  claim: Claim | null
  onClose?: () => void
  onStatusChange?: (id: string, status: Claim['status']) => void
}

const STATUS_BADGE: Record<Claim['status'], string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  approved: 'bg-green-500/15 text-green-400',
  rejected: 'bg-red-500/15 text-red-400',
  queried: 'bg-purple-500/15 text-purple-400',
}

/** "Aciro Grace" -> "Grace A." (given name + surname initial). */
function redactName(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length < 2) return name
  return `${parts.slice(1).join(' ')} ${parts[0][0]}.`
}

export function ClaimDetail({
  claim,
  onClose,
  onStatusChange,
}: ClaimDetailProps) {
  const [status, setStatus] = useState<Claim['status']>(claim?.status ?? 'pending')
  const [showApprove, setShowApprove] = useState(false)
  const [showQuery, setShowQuery] = useState(false)
  const [queryReason, setQueryReason] = useState('')
  const [toast, setToast] = useState('')

  // Reset local state when a different claim is selected.
  useEffect(() => {
    setStatus(claim?.status ?? 'pending')
    setShowApprove(false)
    setShowQuery(false)
    setQueryReason('')
  }, [claim?.id, claim?.status])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  if (!claim) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed bg-muted px-6 py-16 text-center">
        <FileText className="size-10 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          Select a claim from the list to view details
        </p>
      </div>
    )
  }

  const facility = getFacilityById(claim.facilityId)
  const patient = getPatientById(claim.patientHieId)

  // Best-effort condition match against the diagnosis text.
  const dxWords = claim.diagnosis.toLowerCase().match(/[a-z]{4,}/g) ?? []
  const primaryCondition =
    patient?.conditions.find((c) =>
      dxWords.some((w) => c.toLowerCase().includes(w))
    ) ?? patient?.conditions[0]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-semibold text-foreground">
            {claim.id}
          </span>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
              STATUS_BADGE[status]
            )}
          >
            {status}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Section 1 — Claim Summary */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Claim Summary</h3>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Row label="Facility" value={`${claim.facilityName}${facility ? ` · ${facility.level}` : ''}`} />
          <Row label="Insurer" value={claim.insurer} />
          <Row label="Diagnosis" value={claim.diagnosis} />
          <Row label="Procedure code" value={claim.procedureCode} mono />
          <Row label="Submitted" value={formatDate(claim.submittedAt)} />
          <div>
            <dt className="text-xs text-muted-foreground">Amount claimed</dt>
            <dd className="text-lg font-bold text-blue-400">
              {formatUGX(claim.amountUGX)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Section 2 — Patient Clinical Summary */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Patient Clinical Summary
          </h3>
          {patient ? (
            <>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">
                  {redactName(patient.name)}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                  {patient.age}
                  {patient.sex}
                </span>
                <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {patient.bloodGroup}
                </span>
              </div>
              {primaryCondition && (
                <p className="mt-2 text-sm text-foreground">
                  Primary condition: {primaryCondition}
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Full record access requires patient consent or emergency
                authorization.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Patient clinical summary not available for this claim.
            </p>
          )}
        </div>
        {patient && patient.allergies.length > 0 && (
          <div className="bg-red-600 px-5 py-2 text-sm font-semibold text-white">
            ⚠ ALLERGIES: {patient.allergies.join(' · ')}
          </div>
        )}
      </div>

      {/* Section 3 — Supporting Documents */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Supporting Documents
        </h3>
        <ul className="space-y-2">
          {claim.supportingDocuments.map((doc) => (
            <li
              key={doc}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 text-foreground">
                <FileText className="size-4 text-muted-foreground" />
                {doc}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => showToast('Document preview not available in demo')}
              >
                View
              </Button>
            </li>
          ))}
          {claim.supportingDocuments.length === 0 && (
            <li className="text-sm text-muted-foreground">
              No documents attached.
            </li>
          )}
        </ul>
      </div>

      {/* Validation checklist — pending/queried only */}
      {(status === 'pending' || status === 'queried') && (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Claim Validation Checks
          </h3>
          <ul className="space-y-2">
            <CheckRow
              pass={claim.diagnosis.trim().length > 0}
              label="Diagnosis code present"
            />
            <CheckRow pass label="Facility licensed" />
            <CheckRow
              pass={claim.supportingDocuments.length > 0}
              label="Documents attached"
            />
            <CheckRow pass label="No duplicate within 14 days" />
            <CheckRow
              pass={claim.amountUGX <= 500000}
              label="Amount vs district average"
              flagText={
                claim.amountUGX > 500000
                  ? 'Amount 22% above district average — verify'
                  : 'Within expected range ✓'
              }
            />
          </ul>
        </div>
      )}

      {/* Section 4 — Decision / outcome */}
      {(status === 'pending' || status === 'queried') && (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Claim Decision
          </h3>
          {showQuery ? (
            <div className="space-y-2">
              <Textarea
                value={queryReason}
                onChange={(e) => setQueryReason(e.target.value)}
                rows={3}
                placeholder="Enter query reason…"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowQuery(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={queryReason.trim().length === 0}
                  onClick={() => {
                    setStatus('queried')
                    setShowQuery(false)
                    onStatusChange?.(claim.id, 'queried')
                    showToast('Claim queried — facility notified')
                  }}
                >
                  Submit query
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowApprove(true)}
              >
                Approve Claim
              </Button>
              <Button
                variant="outline"
                className="border-amber-300 text-amber-400 hover:bg-amber-500/10"
                onClick={() => setShowQuery(true)}
              >
                Query Claim
              </Button>
            </div>
          )}
        </div>
      )}

      {status === 'approved' && (
        <div className="rounded-xl bg-green-500/10 px-5 py-4 text-sm font-medium text-green-400">
          Approved — Payment processing initiated.
        </div>
      )}
      {status === 'rejected' && (
        <div className="rounded-xl bg-red-500/10 px-5 py-4 text-sm text-red-400">
          Rejected{claim.rejectionReason ? ` — ${claim.rejectionReason}` : ''}.
        </div>
      )}

      {/* Lawful basis */}
      <p className="text-xs text-muted-foreground">
        Access permitted under Uganda National Health Insurance Act — minimum
        necessary clinical data for claim verification only.
      </p>

      {/* Approve confirmation */}
      <Dialog open={showApprove} onOpenChange={setShowApprove}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve claim?</DialogTitle>
            <DialogDescription>
              Confirm approval of {formatUGX(claim.amountUGX)} for{' '}
              {claim.facilityName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprove(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setStatus('approved')
                setShowApprove(false)
                onStatusChange?.(claim.id, 'approved')
                showToast('Claim approved — payment processing initiated')
              }}
            >
              Confirm approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

function CheckRow({
  pass,
  label,
  flagText,
}: {
  pass: boolean
  label: string
  flagText?: string
}) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {pass ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
      ) : (
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
      )}
      <span className="text-foreground">
        {label}
        {flagText && (
          <span
            className={cn(
              'ml-1 text-xs',
              pass ? 'text-muted-foreground' : 'text-amber-400'
            )}
          >
            — {flagText}
          </span>
        )}
      </span>
    </li>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn('text-foreground', mono && 'font-mono text-sm')}>{value}</dd>
    </div>
  )
}
