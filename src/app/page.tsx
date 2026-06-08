import Link from "next/link"
import { ArrowRight, Activity } from "lucide-react"
import { DEMO_USERS, type DemoRole } from "@/types/user"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Where each role's "Enter portal" link lands.
const ROLE_ROUTES: Record<DemoRole, string> = {
  "moh-analyst": "/moh",
  "facility-nurse": "/facility",
  doctor: "/doctor",
  patient: "/patient",
  insurer: "/insurer",
  admin: "/admin/audit",
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-background">
      <main className="w-full max-w-5xl px-6 py-16 sm:py-24">
        <header className="mb-12 flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            <Activity className="size-3.5" />
            Interactive demo · synthetic data
          </span>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Uganda Health Information Exchange
          </h1>
          <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
            A unified national platform connecting facilities, clinicians,
            patients, insurers and the Ministry of Health. Choose a role below to
            explore its portal.
          </p>
        </header>

        <section
          aria-label="Demo roles"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {DEMO_USERS.map((user) => (
            <Card key={user.role} className="flex flex-col">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`size-2.5 rounded-full ${user.color}`}
                    aria-hidden
                  />
                  <CardTitle className="text-base">{user.label}</CardTitle>
                </div>
                <CardDescription>{user.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {user.name}
                </span>
                <Button asChild size="sm" variant="secondary">
                  <Link href={ROLE_ROUTES[user.role]}>
                    Enter <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <footer className="mt-16 text-sm text-muted-foreground">
          Demo build · all patient and facility data is synthetic.
        </footer>
      </main>
    </div>
  )
}
