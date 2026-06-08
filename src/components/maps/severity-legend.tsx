import { getSeverityHex, getSeverityLabel } from '@/lib/severity'

const LEGEND_ITEMS: Array<{ severity: string; label: string }> = [
  { severity: 'critical', label: 'Critical hotspot' },
  { severity: 'high', label: 'High burden' },
  { severity: 'moderate', label: 'Moderate' },
  { severity: 'watch', label: 'Watch / low' },
  { severity: 'none', label: 'No signal' },
  { severity: 'missing', label: 'Data missing' },
]

export function SeverityLegend() {
  return (
    <div className="rounded-xl border bg-card p-3 shadow-sm">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Severity
      </h4>
      <ul className="space-y-1.5">
        {LEGEND_ITEMS.map((item) => (
          <li key={item.severity} className="flex items-center gap-2">
            <span
              className="size-4 shrink-0 rounded-sm"
              style={{
                backgroundColor: getSeverityHex(item.severity),
                border:
                  item.severity === 'missing'
                    ? '1px dashed #94a3b8'
                    : '1px solid rgba(0,0,0,0.08)',
              }}
              title={getSeverityLabel(item.severity)}
              aria-hidden
            />
            <span className="text-xs text-foreground">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
