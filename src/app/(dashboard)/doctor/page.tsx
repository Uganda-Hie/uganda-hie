'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Lock, Info, SearchX } from 'lucide-react'
import { PATIENTS, searchPatients } from '@/data/patients'
import { PatientCard } from '@/components/patient/patient-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Input } from '@/components/ui/input'

export default function DoctorSearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const results = query.trim() ? searchPatients(query.trim()) : PATIENTS

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Patient Record Lookup</h2>
        <p className="text-sm text-muted-foreground">
          Search by name, HIE ID, or phone number
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, HIE ID (e.g. HIE-2024-00142), or phone number..."
          className="h-12 pl-9 pr-9 text-base"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-900"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {results.map((patient) => {
            const locked = patient.consentStatus === 'none'
            return (
              <button
                key={patient.hieId}
                type="button"
                onClick={() => router.push(`/doctor/patient/${patient.hieId}`)}
                className="relative text-left transition-transform hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <PatientCard patient={patient} compact />
                {locked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl bg-white/70 backdrop-blur-[1px]">
                    <Lock className="size-5 text-red-600" />
                    <span className="text-xs font-medium text-red-700">
                      Emergency access required
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-gray-50">
          <EmptyState
            icon={SearchX}
            title={`No patients found matching “${query}”`}
            subtitle="Check the HIE ID format (e.g. HIE-2024-00142) or try a name or phone number."
          />
        </div>
      )}

      {/* Access notice */}
      <div className="flex items-start gap-2 rounded-xl border bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-600" />
        <div>
          <span className="font-medium">Access Notice. </span>
          All patient record access is logged and auditable. Emergency access
          requires documented clinical justification.
        </div>
      </div>
    </div>
  )
}
