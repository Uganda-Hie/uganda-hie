import { format, parseISO } from 'date-fns'
import { Phone } from 'lucide-react'
import type { Patient } from '@/types/patient'
import { getFacilityById } from '@/data/facilities'
import { DISTRICTS } from '@/data/districts'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PatientCardProps {
  patient: Patient
  emergencyMode?: boolean
  accessedAt?: string
  compact?: boolean
}

const CONSENT: Record<
  Patient['consentStatus'],
  { cls: string; label: string }
> = {
  full: { cls: 'bg-green-500/15 text-green-400', label: 'Consent: Full Access' },
  'emergency-only': {
    cls: 'bg-amber-500/15 text-amber-400',
    label: 'Consent: Emergency Only',
  },
  none: { cls: 'bg-red-500/15 text-red-400', label: 'Consent: Not Given' },
}

export function PatientCard({
  patient,
  emergencyMode = false,
  accessedAt,
  compact = false,
}: PatientCardProps) {
  const facility = getFacilityById(patient.primaryFacilityId)
  const district = DISTRICTS.find((d) => d.id === patient.districtId)
  const consent = CONSENT[patient.consentStatus]

  // Compact variant — used in search result grids.
  if (compact) {
    return (
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground">
              {patient.name}
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              {patient.hieId}
            </p>
          </div>
          <span className="shrink-0 rounded-md bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
            {patient.bloodGroup}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
            {patient.age}
            {patient.sex}
          </span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              consent.cls
            )}
          >
            {consent.label}
          </span>
        </div>
        {patient.conditions.length > 0 && (
          <p className="mt-2 truncate text-xs text-muted-foreground">
            {patient.conditions.slice(0, 2).join(' · ')}
          </p>
        )}
      </div>
    )
  }

  let accessedLabel = ''
  if (accessedAt) {
    try {
      accessedLabel = format(parseISO(accessedAt), 'd MMM yyyy, HH:mm')
    } catch {
      accessedLabel = accessedAt
    }
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-card shadow-sm',
        emergencyMode && 'border-t-4 border-t-red-500'
      )}
    >
      {/* Emergency banner */}
      {emergencyMode && (
        <div className="bg-red-600 px-4 py-2 text-xs font-medium text-white">
          ⚠ EMERGENCY ACCESS — Accessed at {accessedLabel || 'now'} ·
          Auto-revokes in 2 hours · This session is being recorded
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        {/* Left */}
        <div className="space-y-2">
          <div>
            <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
            <p className="font-mono text-xs text-muted-foreground">
              {patient.hieId}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
              {patient.age}
              {patient.sex}
            </span>
            <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
              {patient.bloodGroup}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {district?.name ?? patient.districtId}
            {facility ? ` · ${facility.name}` : ''}
          </p>
        </div>

        {/* Right */}
        <div className="space-y-2 sm:text-right">
          <div>
            <span
              className={cn(
                'inline-block rounded-full px-2.5 py-1 text-xs font-medium',
                consent.cls
              )}
            >
              {consent.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Last visit: {formatDate(patient.lastVisit)}
          </p>

          {/* Next of kin */}
          <div
            className={cn(
              'rounded-lg text-xs sm:text-left',
              emergencyMode
                ? 'bg-red-500/10 p-3 text-red-900'
                : 'text-muted-foreground'
            )}
          >
            <div className="font-medium text-foreground">
              Next of kin: {patient.nextOfKin.name} ({patient.nextOfKin.relationship})
            </div>
            {emergencyMode ? (
              <a
                href={`tel:${patient.nextOfKin.phone.replace(/\s/g, '')}`}
                className="mt-1 inline-flex items-center gap-1 font-semibold text-red-400"
              >
                <Phone className="size-3.5" />
                {patient.nextOfKin.phone} — Call Now
              </a>
            ) : (
              <div>{patient.nextOfKin.phone}</div>
            )}
          </div>
        </div>
      </div>

      {/* Allergies strip */}
      {patient.allergies.length > 0 && (
        <div className="bg-red-600 px-4 py-2 text-sm font-semibold text-white">
          ⚠ ALLERGIES: {patient.allergies.join(' · ')}
        </div>
      )}
    </div>
  )
}
