'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDemoStore } from '@/store/demo-store'
import { DEMO_USERS, type DemoRole } from '@/types/user'

// Keys 1–6 map to roles in DEMO_USERS order.
const ROLE_ROUTES: Record<DemoRole, string> = {
  'moh-analyst': '/moh',
  'facility-nurse': '/facility',
  doctor: '/doctor',
  patient: '/patient',
  insurer: '/insurer',
  admin: '/admin/audit',
}

/** Press 1–6 to jump between role portals (ignored while typing in a field). */
export function KeyboardShortcuts() {
  const router = useRouter()
  const setRole = useDemoStore((s) => s.setRole)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.tagName === 'SELECT' ||
          t.isContentEditable)
      ) {
        return
      }
      const idx = Number(e.key)
      if (Number.isInteger(idx) && idx >= 1 && idx <= 6) {
        const user = DEMO_USERS[idx - 1]
        if (user) {
          setRole(user.role)
          router.push(ROLE_ROUTES[user.role])
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router, setRole])

  return null
}
