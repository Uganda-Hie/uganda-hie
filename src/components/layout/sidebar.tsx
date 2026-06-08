'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Map,
  Building2,
  Package,
  ShieldCheck,
  Home,
  ClipboardList,
  Search,
  Heart,
  Share2,
  FileText,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import { useDemoStore } from '@/store/demo-store'
import { type DemoRole } from '@/types/user'
import { cn } from '@/lib/utils'
import { RoleSwitcher } from '@/components/layout/role-switcher'
import { DemoBadge } from '@/components/layout/demo-badge'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const NAV_ITEMS: Record<DemoRole, NavItem[]> = {
  'moh-analyst': [
    { label: 'National Snapshot', href: '/moh', icon: LayoutDashboard },
    { label: 'Disease Map', href: '/moh/disease-map', icon: Map },
    { label: 'Hospital Capacity', href: '/moh/capacity', icon: Building2 },
    { label: 'Medicine Stock', href: '/moh/stock', icon: Package },
    { label: 'Data Quality', href: '/moh/data-quality', icon: ShieldCheck },
  ],
  'facility-nurse': [
    { label: 'Facility Overview', href: '/facility', icon: Home },
    { label: 'Daily Report', href: '/facility/report', icon: ClipboardList },
  ],
  doctor: [{ label: 'Patient Search', href: '/doctor', icon: Search }],
  patient: [
    { label: 'My Health', href: '/patient', icon: Heart },
    { label: 'Sharing & Access', href: '/patient/sharing', icon: Share2 },
  ],
  insurer: [{ label: 'Claims Inbox', href: '/insurer', icon: FileText }],
  admin: [{ label: 'Audit Logs', href: '/admin/audit', icon: Shield }],
}

export function Sidebar() {
  const pathname = usePathname()
  const activeRole = useDemoStore((s) => s.activeRole)
  const items = NAV_ITEMS[activeRole] ?? []

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-white">
      {/* Logo */}
      <div className="border-b px-5 py-4">
        <div className="text-lg font-bold leading-tight">Uganda HIE</div>
        <div className="text-xs text-muted-foreground">Public Health Platform</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-3 border-t p-3">
        <RoleSwitcher />
        <DemoBadge className="w-full justify-center" />
      </div>
    </aside>
  )
}
