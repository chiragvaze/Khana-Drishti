import React from 'react'
import { AlertCircle, Inbox, Loader2 } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/utils'

// Loading State
export interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-text-secondary", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-amber mb-4" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

// Empty State
export interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ElementType
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title = 'No Data Found',
  description = 'There is no data available to display at this time.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-border bg-mine-black", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-raised mb-4">
        <Icon className="h-6 w-6 text-text-muted" />
      </div>
      <h3 className="text-lg font-heading font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// Error State
export interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content. Please try again.',
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-lg border border-red/20 bg-mine-black", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-dim mb-4">
        <AlertCircle className="h-6 w-6 text-red" />
      </div>
      <h3 className="text-lg font-heading font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="destructive">
          Try Again
        </Button>
      )}
    </div>
  )
}
