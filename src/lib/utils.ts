import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number as Ugandan shillings, e.g. 450000 -> "UGX 450,000". */
export function formatUGX(amount: number): string {
  return `UGX ${Math.round(amount).toLocaleString("en-US")}`
}

/** Format an ISO date string as "12 Jun 2026". */
export function formatDate(iso: string): string {
  return format(parseISO(iso), "d MMM yyyy")
}

/** Format a percentage value with an explicit sign, e.g. 38 -> "+38%", -12 -> "-12%". */
export function formatPercent(value: number): string {
  const rounded = Math.round(value)
  const sign = rounded > 0 ? "+" : ""
  return `${sign}${rounded}%`
}

/** Relative time from an ISO string, e.g. "2 hours ago", "3 days ago". */
export function timeAgo(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true })
}
