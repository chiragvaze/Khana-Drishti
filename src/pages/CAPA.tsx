import { useState, useMemo } from 'react'
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { StatusBadge } from '../components/shared/StatusBadge'
import { KPICard } from '../components/shared/KPICard'
import { capas } from '../data/capas'
import { formatDate, daysUntil, cn } from '../lib/utils'

const statusTabs = ['ALL', 'OPEN', 'IN_PROGRESS', 'OVERDUE', 'CLOSED'] as const

export default function CAPAPage() {
  const [activeTab, setActiveTab] = useState<string>('ALL')
  const [selectedCAPA, setSelectedCAPA] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (activeTab === 'ALL') return capas
    return capas.filter((c) => c.status === activeTab)
  }, [activeTab])

  const openCount = capas.filter((c) => c.status === 'OPEN').length
  const inProgressCount = capas.filter((c) => c.status === 'IN_PROGRESS').length
  const overdueCount = capas.filter((c) => c.status === 'OVERDUE').length
  const closedCount = capas.filter((c) => c.status === 'CLOSED').length

  const selectedCAPAData = capas.find((c) => c.id === selectedCAPA)

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Open" value={openCount} icon={<AlertTriangle className="w-4 h-4" />} variant="warning" />
        <KPICard label="In Progress" value={inProgressCount} icon={<Clock className="w-4 h-4" />} />
        <KPICard label="Overdue" value={overdueCount} icon={<ClipboardCheck className="w-4 h-4" />} variant="danger" />
        <KPICard label="Closed" value={closedCount} icon={<CheckCircle className="w-4 h-4" />} variant="success" />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 border-b border-border">
        {statusTabs.map((tab) => {
          const count = tab === 'ALL' ? capas.length : capas.filter((c) => c.status === tab).length
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 text-[12px] font-medium transition-colors relative',
                activeTab === tab ? 'text-amber' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {tab.replace('_', ' ')} ({count})
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber" />}
            </button>
          )
        })}
      </div>

      {/* CAPA List + Detail */}
      <div className="flex gap-4">
        {/* List */}
        <div className={cn('space-y-3 transition-all', selectedCAPA ? 'w-1/2' : 'w-full')}>
          {filtered.map((capa) => {
            const daysLeft = daysUntil(capa.dueDate)
            const isOverdue = capa.status === 'OVERDUE' || daysLeft < 0
            return (
              <div
                key={capa.id}
                onClick={() => setSelectedCAPA(selectedCAPA === capa.id ? null : capa.id)}
                className={cn(
                  'bg-surface-raised border rounded p-4 cursor-pointer transition-all',
                  selectedCAPA === capa.id ? 'border-amber/50' : 'border-border hover:border-border-light'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={capa.priority} />
                      <StatusBadge status={capa.status} />
                      <span className="text-[10px] text-text-muted font-mono">{capa.id}</span>
                    </div>
                    <h4 className="text-[13px] font-medium text-text-primary mt-1">{capa.title}</h4>
                    <p className="text-[12px] text-text-secondary mt-0.5">{capa.mineName} • {capa.assignedContractor}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={cn(
                      'text-[13px] font-mono font-bold',
                      isOverdue ? 'text-red' : daysLeft <= 2 ? 'text-amber' : 'text-green'
                    )}>
                      {capa.status === 'CLOSED' ? 'Completed' : isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                    </p>
                    <p className="text-[10px] text-text-muted mt-0.5">Due: {formatDate(capa.dueDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-1.5 bg-mine-black rounded overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded transition-all',
                        isOverdue ? 'bg-red' : capa.status === 'CLOSED' ? 'bg-green' : 'bg-amber'
                      )}
                      style={{ width: `${capa.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-text-secondary">{capa.progressPercent}%</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail Panel */}
        {selectedCAPAData && (
          <div className="w-1/2 bg-surface-raised border border-border rounded p-5 sticky top-0 self-start">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-[16px] font-bold text-text-primary tracking-wide">CAPA DETAIL</h3>
              <button onClick={() => setSelectedCAPA(null)} className="text-text-muted hover:text-text-secondary text-[12px]">
                Close ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Title</span>
                <p className="text-[13px] text-text-primary mt-0.5">{selectedCAPAData.title}</p>
              </div>
              <div>
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Description</span>
                <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">{selectedCAPAData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Mine</span>
                  <p className="text-[12px] text-text-primary mt-0.5">{selectedCAPAData.mineName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Contractor</span>
                  <p className="text-[12px] text-text-primary mt-0.5">{selectedCAPAData.assignedContractor}</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Created</span>
                  <p className="text-[12px] font-mono text-text-primary mt-0.5">{formatDate(selectedCAPAData.createdDate)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Due Date</span>
                  <p className="text-[12px] font-mono text-text-primary mt-0.5">{formatDate(selectedCAPAData.dueDate)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">SLA</span>
                  <p className="text-[12px] font-mono text-text-primary mt-0.5">{selectedCAPAData.slaHours} hours</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Progress</span>
                  <p className="text-[12px] font-mono text-text-primary mt-0.5">{selectedCAPAData.progressPercent}%</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Action Items</span>
                <div className="mt-2 space-y-2">
                  {selectedCAPAData.actions.map((action, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className={cn(
                        'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5',
                        i < Math.floor(selectedCAPAData.actions.length * selectedCAPAData.progressPercent / 100)
                          ? 'bg-green border-green text-white'
                          : 'border-border'
                      )}>
                        {i < Math.floor(selectedCAPAData.actions.length * selectedCAPAData.progressPercent / 100) && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                      </div>
                      <span className="text-[12px] text-text-secondary">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
