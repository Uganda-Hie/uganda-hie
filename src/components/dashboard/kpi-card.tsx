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
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50',
  alert = false,
  loading = false,
}: KpiCardProps) {
  const isNumber = typeof value === 'number'
  const hasTrend = typeof trend === 'number' && trend !== 0
  const trendUp = (trend ?? 0) > 0

  return (
    <div
      className={cn(
        'rounded-xl border bg-white p-5 shadow-sm',
        alert && 'border-l-4 border-l-red-500'
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
            <div
              className={cn(
                'flex size-10 items-center justify-center rounded-lg',
                iconBg
              )}
            >
              <Icon className={cn('size-5', iconColor)} />
            </div>

            {hasTrend && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  trendUp
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
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
            <div className="text-2xl font-bold text-gray-900">
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
            <p className="mt-1 text-sm text-muted-foreground">{title}</p>
          </div>

          {/* Subtitle / trend label */}
          {(subtitle || (hasTrend && trendLabel)) && (
            <p className="mt-2 text-xs text-muted-foreground">
              {subtitle ?? trendLabel}
            </p>
          )}
        </>
      )}
    </div>
  )
}
