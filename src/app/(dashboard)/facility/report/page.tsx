'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, CheckCircle2, Info } from 'lucide-react'
import { ReportForm } from '@/components/facility/report-form'
import { SyncAnimation } from '@/components/facility/sync-animation'
import { getReportsByFacility } from '@/data/daily-reports'
import { formatDate } from '@/lib/utils'

const FACILITY_ID = 'f011' // Karenga HCIII

const WHY_IT_MATTERS = [
  'Your data feeds national disease surveillance',
  'MoH analysts see aggregate district trends',
  'Stock alerts trigger central medical stores orders',
  'Maternal deaths trigger automatic DHO notification',
]

const SYNC_ROWS = [
  { label: 'District aggregate', detail: 'Last synced 3h ago' },
  { label: 'National HMIS', detail: 'Last synced 6h ago' },
  { label: 'HIE analytics engine', detail: 'Live' },
]

export default function ReportPage() {
  const router = useRouter()
  const [showSync, setShowSync] = useState(false)

  const today = format(new Date(), 'd MMM yyyy')
  const recentReports = getReportsByFacility(FACILITY_ID)
    .slice()
    .sort((a, b) => b.reportDate.localeCompare(a.reportDate))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/facility"
            className="mb-1 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gray-900"
          >
            <ArrowLeft className="size-4" /> Back to facility
          </Link>
          <h2 className="text-xl font-bold text-gray-900">Daily Facility Report</h2>
          <p className="text-sm text-muted-foreground">
            Karenga HCIII · Kaabong District · {today}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 text-xs text-muted-foreground shadow-sm">
          <p>Reporting window: 07:00 – 20:00</p>
          <p>Reports sync to MoH DHIS2 every 6 hours</p>
          <p className="font-medium text-gray-600">HIE ID: UGA-HCIII-KBG-011</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Form */}
        <div>
          <ReportForm
            facilityId={FACILITY_ID}
            onSubmitSuccess={() => setShowSync(true)}
          />
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          {/* Why this matters */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Info className="size-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">
                Why this matters
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              {WHY_IT_MATTERS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* DHIS2 sync status */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              DHIS2 Sync Status
            </h3>
            <ul className="space-y-2.5">
              {SYNC_ROWS.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-700">{row.label}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    {row.detail}
                    <CheckCircle2 className="size-3.5 text-green-500" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent reports */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Recent Reports
            </h3>
            {recentReports.length > 0 ? (
              <ul className="space-y-2">
                {recentReports.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-gray-700">
                        {formatDate(r.reportDate)}
                      </div>
                      <div className="text-muted-foreground">
                        {r.reporterName}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium capitalize ${
                        r.status === 'validated'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">
                No reports submitted yet from this facility.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submission overlay */}
      <SyncAnimation
        visible={showSync}
        facilityName="Karenga HCIII"
        onComplete={() => {
          setShowSync(false)
          router.push('/facility')
        }}
      />
    </div>
  )
}
