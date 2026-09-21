import type { RiskLevel, CAPAStatus, InspectionStatus, ComplianceStatus } from '../../data/types'
import { cn } from '../../lib/utils'

interface StatusBadgeProps {
  status: RiskLevel | CAPAStatus | InspectionStatus | ComplianceStatus | string
  size?: 'sm' | 'md'
}

const statusConfig: Record<string, { bg: string; text: string; label?: string }> = {
  HIGH: { bg: 'bg-red-dim', text: 'text-red-light' },
  MEDIUM: { bg: 'bg-amber-dim', text: 'text-amber' },
  LOW: { bg: 'bg-green-dim', text: 'text-green-light' },
  OPEN: { bg: 'bg-amber-dim', text: 'text-amber' },
  IN_PROGRESS: { bg: 'bg-blue-950', text: 'text-blue-400', label: 'In Progress' },
  OVERDUE: { bg: 'bg-red-dim', text: 'text-red-light' },
  CLOSED: { bg: 'bg-green-dim', text: 'text-green-light' },
  COMPLETED: { bg: 'bg-green-dim', text: 'text-green-light' },
  SCHEDULED: { bg: 'bg-blue-950', text: 'text-blue-400' },
  PENDING_REVIEW: { bg: 'bg-amber-dim', text: 'text-amber', label: 'Pending Review' },
  COMPLIANT: { bg: 'bg-green-dim', text: 'text-green-light' },
  NON_COMPLIANT: { bg: 'bg-red-dim', text: 'text-red-light', label: 'Non-Compliant' },
  PARTIALLY_COMPLIANT: { bg: 'bg-amber-dim', text: 'text-amber', label: 'Partial' },
  UNDER_REVIEW: { bg: 'bg-blue-950', text: 'text-blue-400', label: 'Under Review' },
  ACTIVE: { bg: 'bg-green-dim', text: 'text-green-light' },
  SUSPENDED: { bg: 'bg-red-dim', text: 'text-red-light' },
  UNDER_MAINTENANCE: { bg: 'bg-amber-dim', text: 'text-amber', label: 'Maintenance' },
  CAPA_ASSIGNED: { bg: 'bg-blue-950', text: 'text-blue-400', label: 'CAPA Assigned' },
  RESOLVED: { bg: 'bg-green-dim', text: 'text-green-light' },
  DRAFT: { bg: 'bg-slate', text: 'text-text-secondary' },
  GENERATED: { bg: 'bg-green-dim', text: 'text-green-light' },
  SUBMITTED: { bg: 'bg-blue-950', text: 'text-blue-400' },
  APPROVED: { bg: 'bg-green-dim', text: 'text-green-light' },
  PENDING: { bg: 'bg-amber-dim', text: 'text-amber' },
  ANALYZED: { bg: 'bg-green-dim', text: 'text-green-light' },
  FLAGGED: { bg: 'bg-red-dim', text: 'text-red-light' },
  VERIFIED: { bg: 'bg-green-dim', text: 'text-green-light' },
  NEW: { bg: 'bg-amber-dim', text: 'text-amber' },
  ACKNOWLEDGED: { bg: 'bg-blue-950', text: 'text-blue-400' },
  ACTED_UPON: { bg: 'bg-green-dim', text: 'text-green-light', label: 'Acted Upon' },
  DISMISSED: { bg: 'bg-slate', text: 'text-text-muted' },
  BLACKLISTED: { bg: 'bg-red-dim', text: 'text-red-light' },
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: 'bg-slate', text: 'text-text-secondary' }
  const label = config.label || status.replace(/_/g, ' ')

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded uppercase tracking-wider',
        config.bg,
        config.text,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
      )}
    >
      {label}
    </span>
  )
}
