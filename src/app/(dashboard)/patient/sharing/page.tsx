'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ShieldCheck,
  Pencil,
  Phone,
  Search,
  Check,
} from 'lucide-react'
import { getPatientById } from '@/data/patients'
import { FACILITIES } from '@/data/facilities'
import { AccessLog } from '@/components/patient/access-log'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

const HIE_ID = 'HIE-2024-00142'

type Consent = 'full' | 'emergency-only' | 'none'

const CONSENT_OPTIONS: {
  value: Consent
  label: string
  desc: string
  selectedBorder: string
}[] = [
  {
    value: 'full',
    label: 'Full Access',
    desc: 'Authorised health workers can view your complete record for care coordination.',
    selectedBorder: 'border-green-500 bg-green-500/10',
  },
  {
    value: 'emergency-only',
    label: 'Emergency Only',
    desc: 'Only accessible during documented emergencies. All access triggers automatic notification to you.',
    selectedBorder: 'border-amber-500 bg-amber-500/10',
  },
  {
    value: 'none',
    label: 'No Access',
    desc: 'Your record is not accessible through the HIE. You will need to present physical records at each facility.',
    selectedBorder: 'border-red-500 bg-red-500/10',
  },
]

interface AccessFacility {
  name: string
  level: string
  lastAccess: string
  revoking?: boolean
}

const INITIAL_FACILITIES: AccessFacility[] = [
  { name: 'Gulu Regional Referral Hospital', level: 'RRH', lastAccess: '7 Jun 2026' },
  { name: 'Lacor Hospital', level: 'Hospital', lastAccess: '2 Jun 2026' },
  { name: 'Gulu HCIV', level: 'HCIV', lastAccess: '20 May 2026' },
  { name: 'Kiwoko Hospital', level: 'Hospital', lastAccess: '14 May 2026' },
]

export default function SharingPage() {
  const patient = getPatientById(HIE_ID)

  const [consent, setConsent] = useState<Consent>(
    (patient?.consentStatus as Consent) ?? 'full'
  )
  const [pendingConsent, setPendingConsent] = useState<Consent | null>(null)
  const [toast, setToast] = useState('')

  const [facilities, setFacilities] = useState<AccessFacility[]>(INITIAL_FACILITIES)
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const [nok, setNok] = useState(
    patient?.nextOfKin ?? { name: '', relationship: '', phone: '' }
  )
  const [editingNok, setEditingNok] = useState(false)
  const [nokSaved, setNokSaved] = useState(false)

  if (!patient) {
    return <p className="text-muted-foreground">Record not found.</p>
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function confirmConsentChange() {
    if (pendingConsent) setConsent(pendingConsent)
    setPendingConsent(null)
  }

  function revoke(name: string) {
    setFacilities((prev) =>
      prev.map((f) => (f.name === name ? { ...f, revoking: true } : f))
    )
    setConfirmRevoke(null)
    setTimeout(() => {
      setFacilities((prev) => prev.filter((f) => f.name !== name))
    }, 400)
  }

  const matches = query.trim()
    ? FACILITIES.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) &&
          !facilities.some((af) => af.name === f.name)
      ).slice(0, 5)
    : []

  function addFacility(name: string, level: string) {
    setFacilities((prev) => [...prev, { name, level, lastAccess: 'Just now' }])
    setQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Row 1 — header */}
      <div>
        <Link
          href="/patient"
          className="mb-1 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to my record
        </Link>
        <h2 className="text-xl font-bold text-foreground">Sharing &amp; Access Control</h2>
        <p className="text-sm text-muted-foreground">
          Control who can access your health record through the Uganda HIE
        </p>
      </div>

      {/* Row 2 — consent control */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-green-400" />
            <h3 className="text-sm font-semibold text-foreground">
              Your Consent Settings
            </h3>
          </div>
          <span className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-medium text-green-400">
            {consent === 'full'
              ? 'Full Access Granted'
              : consent === 'emergency-only'
                ? 'Emergency Only'
                : 'No Access'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {CONSENT_OPTIONS.map((opt) => {
            const selected = consent === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (opt.value !== consent) setPendingConsent(opt.value)
                }}
                className={cn(
                  'rounded-lg border-2 p-4 text-left transition-colors',
                  selected
                    ? opt.selectedBorder
                    : 'border-border hover:border-border'
                )}
              >
                <div className="flex items-center gap-2">
                  {selected && <Check className="size-4 text-green-400" />}
                  <span className="font-medium text-foreground">{opt.label}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={() => showToast('Consent settings updated successfully')}>
            Save
          </Button>
        </div>
      </div>

      {/* Row 3 — facilities + next of kin */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Facilities with access */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Facilities with Access
          </h3>
          <ul className="space-y-2">
            {facilities.map((f) => (
              <li
                key={f.name}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-all duration-300',
                  f.revoking && 'opacity-0 line-through'
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {f.name}
                    </span>
                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {f.level}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last access: {f.lastAccess}
                  </div>
                </div>
                {confirmRevoke === f.name ? (
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => revoke(f.name)}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmRevoke(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 border-red-200 text-red-600 hover:bg-red-500/10"
                    onClick={() => setConfirmRevoke(f.name)}
                  >
                    Revoke
                  </Button>
                )}
              </li>
            ))}
            {facilities.length === 0 && (
              <li className="text-sm text-muted-foreground">
                No facilities currently have access.
              </li>
            )}
          </ul>

          {/* Add facility typeahead */}
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Add a facility…"
              className="pl-9"
            />
            {matches.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-card shadow-lg">
                {matches.map((f) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => addFacility(f.name, f.level)}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      <span>{f.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {f.level}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Next of kin */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Next of Kin</h3>
            {!editingNok && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingNok(true)
                  setNokSaved(false)
                }}
              >
                <Pencil className="size-3.5" /> Edit
              </Button>
            )}
          </div>

          {editingNok ? (
            <div className="space-y-2">
              <Input
                value={nok.name}
                onChange={(e) => setNok({ ...nok, name: e.target.value })}
                placeholder="Name"
              />
              <Input
                value={nok.relationship}
                onChange={(e) => setNok({ ...nok, relationship: e.target.value })}
                placeholder="Relationship"
              />
              <Input
                value={nok.phone}
                onChange={(e) => setNok({ ...nok, phone: e.target.value })}
                placeholder="Phone"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingNok(false)
                    setNokSaved(true)
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              <div className="font-medium text-foreground">{nok.name}</div>
              <div className="text-muted-foreground">{nok.relationship}</div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="size-3.5" /> {nok.phone}
              </div>
              {nokSaved && (
                <div className="flex items-center gap-1 pt-1 text-xs text-green-400">
                  <Check className="size-3.5" /> Saved
                </div>
              )}
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Next of kin is contacted automatically during emergency access
            events.
          </p>
        </div>
      </div>

      {/* Row 4 — full access log */}
      <AccessLog
        patientHieId={HIE_ID}
        showAll={false}
        limit={20}
        title="Full Access History"
      />

      {/* Consent change confirm */}
      <Dialog
        open={pendingConsent !== null}
        onOpenChange={(o) => !o && setPendingConsent(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change consent setting?</DialogTitle>
            <DialogDescription>
              Are you sure you want to change your consent? This affects how
              health workers can coordinate your care in emergencies.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingConsent(null)}>
              Cancel
            </Button>
            <Button onClick={confirmConsentChange}>Confirm change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
          <Check className="size-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  )
}
