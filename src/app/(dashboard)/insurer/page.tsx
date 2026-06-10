'use client'

import { useState } from 'react'
import { Search, Inbox, ShieldCheck } from 'lucide-react'
import { EmptyState } from '@/components/dashboard/empty-state'
import { CLAIMS } from '@/data/claims'
import type { Claim } from '@/types/claim'
import { ClaimCard } from '@/components/claims/claim-card'
import { ClaimDetail } from '@/components/claims/claim-detail'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatUGX } from '@/lib/utils'

type Filter = 'all' | Claim['status']

const FILTERS: Filter[] = ['all', 'pending', 'approved', 'rejected', 'queried']

export default function InsurerPage() {
  const [claims, setClaims] = useState<Claim[]>(CLAIMS)
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [statusFilter, setStatusFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  // Live counts derived from local state so KPIs/badges update on decisions.
  const countOf = (f: Filter) =>
    f === 'all' ? claims.length : claims.filter((c) => c.status === f).length
  const totalValue = claims.reduce((s, c) => s + c.amountUGX, 0)

  const q = query.trim().toLowerCase()
  const filtered = claims.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (!q) return true
    return (
      c.facilityName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    )
  })

  function handleStatusChange(id: string, status: Claim['status']) {
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    setSelectedClaim((prev) => (prev && prev.id === id ? { ...prev, status } : prev))
  }

  return (
    <div className="space-y-6">
      {/* Row 1 — header + KPIs */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Claims Inbox</h2>
          <p className="text-sm text-muted-foreground">
            UAP Uganda Health Insurance
          </p>
        </div>
        <div className="flex flex-wrap gap-6 rounded-xl border bg-card px-5 py-3 shadow-sm">
          <Kpi label="Total Claims" value={String(countOf('all'))} />
          <Kpi label="Pending" value={String(countOf('pending'))} color="text-amber-400" />
          <Kpi label="Approved" value={String(countOf('approved'))} color="text-green-400" />
          <Kpi label="Total Value" value={formatUGX(totalValue)} color="text-blue-400" />
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-2 rounded-lg border border-[rgba(26,107,154,0.15)] bg-[rgba(26,107,154,0.08)] p-3">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#1a6b9a]" />
        <p className="text-xs text-[#8a8f98]">
          <span className="font-medium text-foreground">
            Minimum Necessary Access
          </span>{' '}
          — Insurers can only view claim-specific clinical summaries. Full
          patient records are not accessible through this portal. All access is
          logged and auditable.
        </p>
      </div>

      {/* Row 2 — filter tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as Filter)}>
        <TabsList className="flex-wrap">
          {FILTERS.map((f) => (
            <TabsTrigger key={f} value={f} className="capitalize">
              {f} ({countOf(f)})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Row 3 — list + detail */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
        {/* List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by facility or claim ID…"
              className="pl-9"
            />
          </div>
          <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
            {filtered.length > 0 ? (
              filtered.map((claim) => (
                <ClaimCard
                  key={claim.id}
                  claim={claim}
                  selected={selectedClaim?.id === claim.id}
                  onClick={() => setSelectedClaim(claim)}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed bg-muted">
                <EmptyState
                  icon={Inbox}
                  title="No claims matching this filter"
                  subtitle="Try a different status tab or clear your search."
                />
              </div>
            )}
          </div>
        </div>

        {/* Detail */}
        <div>
          <ClaimDetail
            claim={selectedClaim}
            onClose={() => setSelectedClaim(null)}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  )
}

function Kpi({
  label,
  value,
  color = 'text-foreground',
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  )
}
