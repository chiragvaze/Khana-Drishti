import { useState, useMemo } from 'react'
import { Search, ClipboardCheck, AlertTriangle, Brain, X } from 'lucide-react'
import { StatusBadge } from '../components/shared/StatusBadge'
import { KPICard } from '../components/shared/KPICard'
import { inspections } from '../data/inspections'
import { formatDate, cn } from '../lib/utils'
import { useIsMobile } from '../lib/useIsMobile'


export default function Inspections() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [riskFilter, setRiskFilter] = useState<string>('ALL')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const filtered = useMemo(() => {
    return inspections.filter((i) => {
      const matchSearch =
        i.mineName.toLowerCase().includes(search.toLowerCase()) ||
        i.mineCode.toLowerCase().includes(search.toLowerCase()) ||
        i.inspector.toLowerCase().includes(search.toLowerCase()) ||
        i.id.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'ALL' || i.type === typeFilter
      const matchStatus = statusFilter === 'ALL' || i.status === statusFilter
      const matchRisk = riskFilter === 'ALL' || i.riskLevel === riskFilter
      const matchDate = dateFilter === '' || i.date === dateFilter
      return matchSearch && matchType && matchStatus && matchRisk && matchDate
    })
  }, [search, typeFilter, statusFilter, riskFilter, dateFilter])

  const completed = inspections.filter((i) => i.status === 'COMPLETED').length
  const inProgress = inspections.filter((i) => i.status === 'IN_PROGRESS').length
  const scheduled = inspections.filter((i) => i.status === 'SCHEDULED').length
  const totalHighRisk = inspections.reduce((sum, i) => sum + i.highRiskCount, 0)

  const selectedData = inspections.find((i) => i.id === selectedInspection)

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Inspections" value={inspections.length} icon={<ClipboardCheck className="w-4 h-4" />} />
        <KPICard label="Completed" value={completed} subtitle="this month" variant="success" />
        <KPICard label="In Progress / Scheduled" value={inProgress + scheduled} />
        <KPICard label="High-Risk Findings" value={totalHighRisk} variant="danger" icon={<AlertTriangle className="w-4 h-4" />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-0 max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by mine, inspector, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface-raised border border-border rounded text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none">
          <option value="ALL">All Types</option>
          <option value="ROUTINE">Routine</option>
          <option value="SPECIAL">Special</option>
          <option value="FOLLOW_UP">Follow-Up</option>
          <option value="DGMS_DIRECTED">DGMS Directed</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none">
          <option value="ALL">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="SCHEDULED">Scheduled</option>
        </select>
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none">
          <option value="ALL">All Risks</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <input 
          type="date" 
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)} 
          className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none"
        />
      </div>

      {/* Table + Detail */}
      <div className={cn("gap-4", isMobile ? "flex flex-col" : "flex")}>
        <div className={cn("bg-surface-raised border border-border rounded overflow-hidden", selectedData && !isMobile ? 'flex-1' : 'w-full')}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-mine-black/50">
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Mine</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Inspector</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Risk</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Evidence</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((insp) => (
                  <tr
                    key={insp.id}
                    onClick={() => setSelectedInspection(selectedInspection === insp.id ? null : insp.id)}
                    className={`cursor-pointer transition-colors ${selectedInspection === insp.id ? 'bg-amber-dim' : 'hover:bg-mine-black/50'}`}
                  >
                    <td className="px-4 py-3 text-[12px] font-mono text-text-secondary">{insp.id}</td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-mono text-amber font-medium">{insp.mineCode}</span>
                      <p className="text-[11px] text-text-muted">{insp.mineName}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary">{insp.inspector}</td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary">{insp.type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-[12px] font-mono text-text-primary">{formatDate(insp.date)}</td>
                    <td className="px-4 py-3"><StatusBadge status={insp.riskLevel} /></td>
                    <td className="px-4 py-3 text-[12px] font-mono text-text-primary">{insp.evidenceCount || 0}</td>
                    <td className="px-4 py-3"><StatusBadge status={insp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedData && (
          <div className={cn(
            isMobile
              ? "fixed inset-0 z-50 bg-surface-raised overflow-y-auto p-4"
              : "w-[380px] flex-shrink-0 bg-surface-raised border border-border rounded p-5 self-start sticky top-0"
          )}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-[15px] font-bold text-text-primary tracking-wide">INSPECTION DETAIL</h3>
              <button onClick={() => setSelectedInspection(null)} className="text-text-muted hover:text-text-secondary p-1" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <DetailRow label="ID" value={selectedData.id} mono />
                <DetailRow label="Mine" value={`${selectedData.mineCode} — ${selectedData.mineName}`} />
                <DetailRow label="Date" value={formatDate(selectedData.date)} mono />
                <DetailRow label="Inspector" value={selectedData.inspector} />
                <DetailRow label="Designation" value={selectedData.inspectorDesignation} />
                <DetailRow label="Type" value={selectedData.type.replace(/_/g, ' ')} />
              </div>
              <div className="flex gap-2">
                <StatusBadge status={selectedData.status} size="md" />
                <StatusBadge status={selectedData.riskLevel} size="md" />
              </div>

              {selectedData.checklist && (
                <div className="pt-3 border-t border-border">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider mb-2 block">Checklist</span>
                  <div className="space-y-1.5">
                    {selectedData.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-2 text-[12px]">
                        <span className="text-text-secondary">{item.item}</span>
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${item.status === 'PASS' ? 'bg-green-dim text-green-light' : 'bg-red-dim text-red-light'}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedData.observationsList ? (
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">Observations ({selectedData.observationsCount})</span>
                  </div>
                  <div className="space-y-2">
                    {selectedData.observationsList.map((obs, idx) => (
                      <div key={idx} className="bg-mine-black p-2 rounded flex justify-between items-center">
                        <span className="text-[12px] text-text-primary">{obs.title}</span>
                        <StatusBadge status={obs.risk} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-border">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Findings</span>
                  <p className="text-[12px] text-text-secondary mt-1 leading-relaxed">{selectedData.findings}</p>
                </div>
              )}

              {selectedData.aiVerification && (
                <div className="pt-3 border-t border-border">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Brain className="w-3 h-3 text-amber" /> AI Verification
                  </span>
                  <p className="text-[12px] text-text-secondary leading-relaxed">{selectedData.aiVerification}</p>
                </div>
              )}

              {selectedData.evidenceCount !== undefined && (
                <div className="pt-3 border-t border-border">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider mb-2 block">Evidence Attached</span>
                  <p className="text-[12px] font-mono text-text-primary">{selectedData.evidenceCount} files</p>
                </div>
              )}

              {selectedData.applicableObligations && (
                <div className="pt-3 border-t border-border">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider mb-2 block">Applicable Obligations</span>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedData.applicableObligations.map((ob, idx) => (
                      <li key={idx} className="text-[12px] text-text-secondary">{ob}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <span className="text-[10px] text-text-muted uppercase tracking-wider">{label}</span>
      <p className={`text-[12px] text-text-primary mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}
