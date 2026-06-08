'use client'

import { useEffect, useState } from 'react'
import { Siren, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

interface EmergencyModalProps {
  open: boolean
  onConfirm: (reason: string) => void
  onCancel: () => void
}

const MIN_REASON = 20

export function EmergencyModal({
  open,
  onConfirm,
  onCancel,
}: EmergencyModalProps) {
  const [reason, setReason] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Reset state whenever the dialog opens/closes.
  useEffect(() => {
    if (!open) {
      setReason('')
      setAccepted(false)
      setSubmitting(false)
    }
  }, [open])

  const canConfirm = reason.trim().length >= MIN_REASON && accepted && !submitting

  function handleConfirm() {
    if (!canConfirm) return
    setSubmitting(true)
    setTimeout(() => {
      onConfirm(reason.trim())
      setSubmitting(false)
    }, 1000)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onCancel()
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Siren className="size-5" />
            Emergency Patient Access
          </DialogTitle>
          <DialogDescription>
            This action will be permanently logged and reviewed by the Data
            Protection Officer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amber warning */}
          <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
            You are about to access a patient record without their prior consent.
            This is permitted under Uganda&apos;s Public Health Act for emergency
            care only.
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label htmlFor="emergency-reason" className="text-sm font-medium">
              Reason for emergency access{' '}
              <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="emergency-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Road accident — unconscious patient, no ID, requires immediate blood type and allergy check"
            />
            <div className="text-right text-xs text-muted-foreground">
              <span
                className={
                  reason.trim().length >= MIN_REASON
                    ? 'text-green-600'
                    : 'text-muted-foreground'
                }
              >
                {reason.trim().length}
              </span>
              /{MIN_REASON} min characters
            </div>
          </div>

          {/* Accountability checkbox */}
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <Checkbox
              checked={accepted}
              onCheckedChange={(v) => setAccepted(v === true)}
              className="mt-0.5"
            />
            <span>
              I confirm this is a genuine medical emergency and I accept full
              accountability for this access.
            </span>
          </label>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Granting…
              </>
            ) : (
              'Grant Emergency Access'
            )}
          </Button>
        </DialogFooter>

        <p className="text-center text-xs text-muted-foreground">
          Access granted for 2 hours only · Auto-revoked at session end · Logged
          to audit trail
        </p>
      </DialogContent>
    </Dialog>
  )
}
