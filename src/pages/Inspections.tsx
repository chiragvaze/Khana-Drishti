import { useState, useMemo } from 'react'
import { Search, ClipboardCheck, AlertTriangle } from 'lucide-react'
import { StatusBadge } from '../components/shared/StatusBadge'
import { KPICard } from '../components/shared/KPICard'
import { inspections } from '../data/inspections'
import { formatDate } from '../lib/utils'

export default function Inspections() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return inspections.filter((i) => {
      const matchSearch =
        i.mineName.toLowerCase().includes(search.toLowerCase()) ||
        i.mineCode.toLowerCase().includes(search.toLowerCase()) ||
        i.inspector.toLowerCase().includes(search.toLowerCase()) ||
        i.id.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'ALL' || i.type === typeFilter
      const matchStatus = statusFilter === 'ALL' || i.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [search, typeFilter, statusFilter])

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
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
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
      </div>

      {/* Table + Detail */}
      <div className="flex gap-4">
        <div className={`bg-surface-raised border border-border rounded overflow-hidden ${selectedData ? 'flex-1' : 'w-full'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-mine-black/50">
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Mine</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Inspector</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Obs.</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((insp) => (
                  <tr
                    key={insp.id}
                    onClick={() => setSelectedInspection(selectedInspection === insp.id ? null : insp.id)}
                    className={`cursor-pointer transition-colors ${selectedInspection === insp.id ? 'bg-amber-dim' : 'hover:bg-mine-black/50'}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-mono text-amber font-medium">{insp.mineCode}</span>
                      <p className="text-[11px] text-text-muted">{insp.mineName}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] font-mono text-text-primary">{formatDate(insp.date)}</td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary">{insp.inspector}</td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary">{insp.type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3"><StatusBadge status={insp.status} /></td>
                    <td className="px-4 py-3 text-[12px] font-mono text-text-primary">
                      {insp.observationsCount}
                      {insp.highRiskCount > 0 && <span className="text-red ml-1">({insp.highRiskCount})</span>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={insp.riskLevel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedData && (
          <div className="w-[380px] flex-shrink-0 bg-surface-raised border border-border rounded p-5 self-start sticky top-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-[15px] font-bold text-text-primary tracking-wide">INSPECTION DETAIL</h3>
              <button onClick={() => setSelectedInspection(null)} className="text-text-muted hover:text-text-secondary text-[12px]">✕</button>
            </div>
            <div className="space-y-3">
              <DetailRow label="Mine" value={`${selectedData.mineCode} — ${selectedData.mineName}`} />
              <DetailRow label="Date" value={formatDate(selectedData.date)} mono />
              <DetailRow label="Inspector" value={selectedData.inspector} />
              <DetailRow label="Designation" value={selectedData.inspectorDesignation} />
              <DetailRow label="Type" value={selectedData.type.replace(/_/g, ' ')} />
              <div className="flex gap-2">
                <StatusBadge status={selectedData.status} size="md" />
                <StatusBadge status={selectedData.riskLevel} size="md" />
              </div>
              <div className="pt-3 border-t border-border">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Findings</span>
                <p className="text-[12px] text-text-secondary mt-1 leading-relaxed">{selectedData.findings}</p>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Observations</span>
                <p className="text-[14px] font-mono font-bold text-text-primary mt-0.5">
                  {selectedData.observationsCount} total, {selectedData.highRiskCount} high-risk
                </p>
              </div>
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
