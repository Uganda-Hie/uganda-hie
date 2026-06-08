'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Topbar } from '@/components/layout/topbar'
import { DashboardSkeleton } from '@/components/layout/dashboard-skeleton'
import { KeyboardShortcuts } from '@/components/layout/keyboard-shortcuts'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [loaded, setLoaded] = useState(false)

  // Brief skeleton gate on first render and every route change.
  useEffect(() => {
    setLoaded(false)
    const t = setTimeout(() => setLoaded(true), 400)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {loaded ? (
            <div className="animate-in fade-in duration-300">{children}</div>
          ) : (
            <DashboardSkeleton />
          )}
        </main>
      </div>
      <MobileNav />
      <KeyboardShortcuts />
    </div>
  )
}
