import { cn } from '../../lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  trendPositive?: boolean
  icon?: React.ReactNode
  variant?: 'default' | 'danger' | 'warning' | 'success'
}

export function KPICard({
  label,
  value,
  subtitle,
  trend,
  trendValue,
  trendPositive,
  icon,
  variant = 'default',
}: KPICardProps) {
  const borderColor = {
    default: 'border-border',
    danger: 'border-red/30',
    warning: 'border-amber/30',
    success: 'border-green/30',
  }[variant]

  return (
    <div
      className={cn(
        'bg-surface-raised border rounded p-4 flex flex-col gap-1',
        borderColor
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium">
          {label}
        </span>
        {icon && <div className="text-text-muted">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold text-text-primary">{value}</span>
        {subtitle && (
          <span className="text-[11px] text-text-muted">{subtitle}</span>
        )}
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-1 mt-0.5">
          {trend === 'up' ? (
            <TrendingUp className={cn('w-3 h-3', trendPositive ? 'text-green' : 'text-red')} />
          ) : trend === 'down' ? (
            <TrendingDown className={cn('w-3 h-3', trendPositive ? 'text-green' : 'text-red')} />
          ) : (
            <Minus className="w-3 h-3 text-text-muted" />
          )}
          <span
            className={cn(
              'text-[11px] font-mono',
              trend === 'neutral'
                ? 'text-text-muted'
                : trendPositive
                ? 'text-green'
                : 'text-red'
            )}
          >
            {trendValue}
          </span>
        </div>
      )}
    </div>
  )
}
