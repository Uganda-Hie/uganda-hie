import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  className?: string
}

/** Consistent empty state — icon + title + subtitle (no raw "No data" text). */
export function EmptyState({ icon: Icon, title, subtitle, className }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-10 text-center ${className ?? ''}`}
    >
      <Icon className="size-10 text-gray-300" />
      <p className="mt-3 text-sm font-medium text-gray-700">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
