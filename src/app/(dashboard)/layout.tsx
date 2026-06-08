export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO: shared sidebar + topbar (components/layout)
  return <div className="min-h-screen bg-background">{children}</div>
}
