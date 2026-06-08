import type { DistrictMetric } from '@/types/district'

export type Severity = DistrictMetric['severity']

const BG_COLORS: Record<Severity, string> = {
  critical: 'bg-red-600',
  high: 'bg-orange-500',
  moderate: 'bg-yellow-400',
  watch: 'bg-yellow-200',
  none: 'bg-gray-100',
  missing: 'bg-gray-300',
}

const TEXT_COLORS: Record<Severity, string> = {
  critical: 'text-red-600',
  high: 'text-orange-500',
  moderate: 'text-yellow-600',
  watch: 'text-yellow-500',
  none: 'text-gray-400',
  missing: 'text-gray-500',
}

const HEX_COLORS: Record<Severity, string> = {
  critical: '#dc2626',
  high: '#f97316',
  moderate: '#facc15',
  watch: '#fef08a',
  none: '#f1f5f9',
  missing: '#cbd5e1',
}

const LABELS: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  moderate: 'Moderate',
  watch: 'Watch',
  none: 'No cases',
  missing: 'No report',
}

export function getSeverityColor(severity: string): string {
  return BG_COLORS[severity as Severity] ?? BG_COLORS.missing
}

export function getSeverityTextColor(severity: string): string {
  return TEXT_COLORS[severity as Severity] ?? TEXT_COLORS.missing
}

export function getSeverityHex(severity: string): string {
  return HEX_COLORS[severity as Severity] ?? HEX_COLORS.missing
}

export function getSeverityLabel(severity: string): string {
  return LABELS[severity as Severity] ?? 'Unknown'
}
