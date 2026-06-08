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
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: '#0f172a' }}
    >
      <div className="w-full max-w-5xl">
        {/* Top */}
        <header className="mb-12 flex flex-col items-center text-center">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-300 ring-1 ring-amber-400/30">
            BoU@60 Hackathon Demo
          </span>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Uganda Health Information Exchange
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-400">
            Public Health Intelligence Platform
          </p>
          <p className="mt-4 max-w-2xl text-pretty text-sm text-slate-400">
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
              className="group flex flex-col rounded-xl border border-slate-700/70 bg-slate-800/60 p-5 text-left shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-slate-600 hover:bg-slate-800 hover:shadow-xl hover:shadow-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${user.color}`} aria-hidden />
                <span className="font-semibold text-white">{user.label}</span>
              </div>
              <span className="text-sm text-slate-300">{user.name}</span>
              <span className="mt-2 text-xs leading-relaxed text-slate-400">
                {user.description}
              </span>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                Enter portal <ArrowRight className="size-3.5" />
              </span>
            </button>
          ))}
        </section>

        {/* Bottom */}
        <footer className="mt-14 flex flex-col items-center gap-3 text-center">
          <p className="text-xs text-slate-500">
            All data is synthetic — for demonstration purposes only
          </p>
          <a
            href="https://github.com/Uganda-Hie/uganda-hie"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4 fill-current"
              aria-hidden
            >
              <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
            </svg>
            View source on GitHub
          </a>
        </footer>
      </div>
    </div>
  )
}
