'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDemoStore } from '@/store/demo-store'
import { NAV_ITEMS } from '@/components/layout/sidebar'
import { cn } from '@/lib/utils'

/** Bottom navigation bar shown only below the md breakpoint. */
export function MobileNav() {
  const pathname = usePathname()
  const activeRole = useDemoStore((s) => s.activeRole)
  const items = NAV_ITEMS[activeRole] ?? []

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t bg-card px-1 py-1 md:hidden">
      {items.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[10px] font-medium transition-colors',
              active ? 'text-blue-400' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="size-5 shrink-0" />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
