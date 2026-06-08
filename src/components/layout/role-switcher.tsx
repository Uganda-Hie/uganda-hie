'use client'

import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown } from 'lucide-react'
import { DEMO_USERS, type DemoRole } from '@/types/user'
import { useDemoStore } from '@/store/demo-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

// Default landing route per role.
const ROLE_ROUTES: Record<DemoRole, string> = {
  'moh-analyst': '/moh',
  'facility-nurse': '/facility',
  doctor: '/doctor',
  patient: '/patient',
  insurer: '/insurer',
  admin: '/admin/audit',
}

export function RoleSwitcher() {
  const router = useRouter()
  const activeRole = useDemoStore((s) => s.activeRole)
  const setRole = useDemoStore((s) => s.setRole)

  const current =
    DEMO_USERS.find((u) => u.role === activeRole) ?? DEMO_USERS[0]

  function handleSelect(role: DemoRole) {
    setRole(role)
    router.push(ROLE_ROUTES[role])
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-auto justify-between gap-3 px-3 py-2"
        >
          <span className={`size-2.5 shrink-0 rounded-full ${current.color}`} aria-hidden />
          <span className="flex flex-col items-start text-left leading-tight">
            <span className="text-sm font-medium">{current.name}</span>
            <span className="text-xs text-muted-foreground">{current.label}</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Switch demo role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {DEMO_USERS.map((user) => {
          const isActive = user.role === activeRole
          return (
            <DropdownMenuItem
              key={user.role}
              onSelect={() => handleSelect(user.role)}
              className="flex items-start gap-3 py-2"
            >
              <span
                className={`mt-1 size-2.5 shrink-0 rounded-full ${user.color}`}
                aria-hidden
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    · {user.label}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.description}
                </span>
              </span>
              {isActive && <Check className="mt-1 size-4 shrink-0" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
