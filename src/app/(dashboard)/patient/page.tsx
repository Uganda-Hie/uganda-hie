'use client'

import Link from 'next/link'
import { Activity, Pill, AlertTriangle, ArrowRight } from 'lucide-react'
import { getPatientById } from '@/data/patients'
import { getFacilityById } from '@/data/facilities'
import { ClinicalSummary } from '@/components/patient/clinical-summary'
import { AccessLog } from '@/components/patient/access-log'
import { formatDate } from '@/lib/utils'

const HIE_ID = 'HIE-2024-00142' // Aciro Grace

function initials(name: string): string {
  const parts = name
    .split(' ')
    .filter((p) => !/^(dr\.?|nurse|mr\.?|mrs\.?|ms\.?|prof\.?)$/i.test(p))
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export default function PatientPortalPage() {
  const patient = getPatientById(HIE_ID)
  if (!patient) {
    return <p className="text-muted-foreground">Record not found.</p>
  }

  const facility = getFacilityById(patient.primaryFacilityId)

  return (
    <div className="space-y-6">
      {/* Row 1 — Welcome header */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-orange-500 text-lg font-semibold text-white">
              {initials(patient.name)}
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
              <p className="font-mono text-xs text-muted-foreground">
                {patient.hieId}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {patient.age}
              {patient.sex}
            </span>
            <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
              {patient.bloodGroup}
            </span>
            <span className="text-xs text-muted-foreground">
              {facility?.name ?? '—'}
            </span>
            <span className="text-xs text-muted-foreground">
              Last visit: {formatDate(patient.lastVisit)}
            </span>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800">
          ✓ You have granted full access to your health record. Manage sharing
          below.
        </div>
      </div>

      {/* Row 2 — Summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Conditions */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Active Conditions
            </h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {patient.conditions.length}
            </span>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            {patient.conditions.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <Activity className="size-4 shrink-0 text-blue-600" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Medications */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Current Medications
            </h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {patient.medications.length}
            </span>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            {patient.medications.map((m) => (
              <li key={m} className="flex items-center gap-2">
                <Pill className="size-4 shrink-0 text-violet-600" />
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Allergies */}
        <div className="rounded-xl border border-l-4 border-l-red-500 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Allergies</h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {patient.allergies.length}
            </span>
          </div>
          {patient.allergies.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {patient.allergies.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <AlertTriangle className="size-4 shrink-0 text-red-500" />
                  {a}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-medium text-green-600">
              No known allergies
            </p>
          )}
        </div>
      </div>

      {/* Row 3 — Full clinical record */}
      <ClinicalSummary patient={patient} emergencyMode={false} />

      {/* Row 4 — Access history */}
      <div>
        <AccessLog
          patientHieId={HIE_ID}
          limit={5}
          title="Recent Access to Your Record"
        />
        <div className="mt-3 text-right">
          <Link
            href="/patient/sharing"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View full access history <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
