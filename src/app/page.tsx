'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { DEMO_USERS, type DemoRole } from '@/types/user'
import { useDemoStore } from '@/store/demo-store'

// Default landing route per role (kept in sync with role-switcher).
const ROLE_ROUTES: Record<DemoRole, string> = {
  'moh-analyst': '/moh',
  'facility-nurse': '/facility',
  doctor: '/doctor',
  patient: '/patient',
  insurer: '/insurer',
  admin: '/admin/audit',
}

export default function Home() {
  const router = useRouter()
  const setRole = useDemoStore((s) => s.setRole)

  function enter(role: DemoRole) {
    setRole(role)
    router.push(ROLE_ROUTES[role])
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-16 bg-[#08090a]">
      {/* Subtle blue radial glow behind the title */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(26,107,154,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-5xl">
        {/* Top */}
        <header className="mb-12 flex flex-col items-center text-center">
          <span className="mb-6 inline-flex items-center rounded-full border border-white/8 px-3 py-1 text-xs text-[#62666d]">
            BoU@60 Hackathon Demo
          </span>
          <h1 className="display-lg text-balance text-[#f7f8f8]">
            Uganda Health Information Exchange
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#8a8f98]">
            Public Health Intelligence Platform
          </p>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-[#62666d]">
            Connecting patient records, facility reporting, and MoH intelligence
            across Uganda
          </p>
        </header>

        {/* Role cards */}
        <section
          aria-label="Choose a demo role"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {DEMO_USERS.map((user) => (
            <button
              key={user.role}
              type="button"
              onClick={() => enter(user.role)}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-5 pl-6 text-left transition-all duration-200 hover:border-white/15 hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6b9a]"
            >
              {/* Left accent line in the role colour */}
              <span
                className={`absolute inset-y-0 left-0 w-1 ${user.color}`}
                aria-hidden
              />
              <span className="font-[590] text-sm text-[#f7f8f8]">
                {user.label}
              </span>
              <span className="mt-0.5 text-sm text-[#8a8f98]">{user.name}</span>
              <span className="mt-2 text-xs leading-relaxed text-[#62666d]">
                {user.description}
              </span>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-[510] text-[#2596d4] opacity-0 transition-opacity group-hover:opacity-100">
                Enter portal <ArrowRight className="size-3.5" />
              </span>
            </button>
          ))}
        </section>

        {/* Bottom */}
        <footer className="mt-14 flex flex-col items-center gap-3 text-center">
          <p className="text-xs text-[#62666d]">
            All data is synthetic — for demonstration purposes only
          </p>
          <a
            href="https://github.com/Uganda-Hie/uganda-hie"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#62666d] transition-colors hover:text-[#d0d6e0]"
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
              <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
            </svg>
            View source on GitHub
          </a>
        </footer>
      </div>
    </div>
  )
}
