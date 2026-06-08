'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { format } from 'date-fns'
import { Bell } from 'lucide-react'
import { useDemoStore } from '@/store/demo-store'
import { DEMO_USERS } from '@/types/user'

// Map of route -> page title shown in the bar.
const PAGE_TITLES: Record<string, string> = {
  '/moh': 'National Health Snapshot',
  '/moh/disease-map': 'Disease Intelligence & Hotspot Map',
  '/moh/capacity': 'Hospital Capacity & Referral Intelligence',
  '/moh/stock': 'National Medicine Stock Intelligence',
  '/moh/data-quality': 'Data Quality & Reporting Completeness',
  '/facility': 'Facility Overview',
  '/facility/report': 'Daily Facility Report',
  '/doctor': 'Patient Record Lookup',
  '/patient': 'My Health Record',
  '/patient/sharing': 'Sharing & Access Control',
  '/insurer': 'Claims Inbox',
  '/admin/audit': 'System Audit Log',
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/doctor/patient/')) return 'Patient Record'
  return PAGE_TITLES[pathname] ?? 'Uganda HIE'
}

// "Dr. Nakato Amina" -> "NA" (titles like Dr./Nurse stripped).
function getInitials(name: string): string {
  const parts = name
    .split(' ')
    .filter((p) => !/^(dr\.?|nurse|mr\.?|mrs\.?|ms\.?|prof\.?)$/i.test(p))
  if (parts.length === 0) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : ''
  return (first + last).toUpperCase()
}

export function Topbar() {
  const pathname = usePathname()
  const activeRole = useDemoStore((s) => s.activeRole)
  const user = DEMO_USERS.find((u) => u.role === activeRole) ?? DEMO_USERS[0]

  // Clock — set on mount (avoids SSR hydration mismatch), tick every minute.
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-white/8 bg-[#0f1011] px-6">
      {/* Left: page title */}
      <h1 className="text-sm font-[510] tracking-[-0.13px] text-[#f7f8f8]">
        {getPageTitle(pathname)}
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-[#62666d] tabular-nums">
          {now ? format(now, 'd MMM yyyy, HH:mm') : ' '}
        </span>

        <span className="h-6 w-px bg-white/8" aria-hidden />

        {/* Active user */}
        <div className="flex items-center gap-2">
          <span
            className="flex size-8 items-center justify-center rounded-full bg-[#1a6b9a] text-xs font-semibold text-white"
            aria-hidden
          >
            {getInitials(user.name)}
          </span>
          <span className="text-sm font-[510] text-[#d0d6e0]">{user.label}</span>
        </div>

        {/* Alerts bell */}
        <button
          type="button"
          className="relative rounded-md p-1.5 text-[#8a8f98] hover:bg-white/5 hover:text-[#d0d6e0]"
          aria-label="3 alerts"
          title="3 alerts"
        >
          <Bell className="size-5" />
          <span className="absolute right-1 top-1 size-2 rounded-full bg-[#dc2626] ring-2 ring-[#0f1011]" />
        </button>
      </div>
    </header>
  )
}
