'use client'

import CountUp from 'react-countup'
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: number
  trendLabel?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  alert?: boolean
  loading?: boolean
}

export function KpiCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon: Icon,
  iconColor = 'text-[#1a6b9a]',
  alert = false,
  loading = false,
}: KpiCardProps) {
  const isNumber = typeof value === 'number'
  const hasTrend = typeof trend === 'number' && trend !== 0
  const trendUp = (trend ?? 0) > 0

  return (
    <div
      className={cn(
        'rounded-xl border border-white/8 bg-white/[0.02] p-5',
        alert && 'border-l-2 border-l-[#dc2626]'
      )}
    >
      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ) : (
        <>
          {/* Top row: icon + trend badge */}
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-lg border border-white/8 bg-white/5">
              <Icon className={cn('size-5', iconColor)} />
            </div>

            {hasTrend && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  // Health context: more cases (up) = bad, fewer = good.
                  trendUp
                    ? 'bg-[rgba(220,38,38,0.15)] text-[#dc2626]'
                    : 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]'
                )}
              >
                {trendUp ? (
                  <TrendingUp className="size-3.5" />
                ) : (
                  <TrendingDown className="size-3.5" />
                )}
                {trendUp ? '+' : ''}
                {trend}%
              </span>
            )}
          </div>

          {/* Value + title */}
          <div className="mt-4">
            <div className="text-2xl font-[590] tracking-[-0.704px] text-[#f7f8f8]">
              {isNumber ? (
                <CountUp
                  end={value as number}
                  duration={1.2}
                  separator=","
                  decimals={Number.isInteger(value) ? 0 : 1}
                />
              ) : (
                value
              )}
            </div>
            <p className="mt-1 text-xs font-[510] uppercase tracking-[0.08em] text-[#8a8f98]">
              {title}
            </p>
          </div>

          {/* Subtitle / trend label */}
          {(subtitle || (hasTrend && trendLabel)) && (
            <p className="mt-2 text-xs text-[#62666d]">{subtitle ?? trendLabel}</p>
          )}
        </>
      )}
    </div>
  )
}
