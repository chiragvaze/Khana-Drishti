import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Factory, Search, ArrowUpDown, ShieldAlert } from 'lucide-react'
import { StatusBadge } from '../components/shared/StatusBadge'
import { KPICard } from '../components/shared/KPICard'
import { mines } from '../data/mines'
import { capas } from '../data/capas'
import { formatDate } from '../lib/utils'

export default function Mines() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [riskFilter, setRiskFilter] = useState<string>('ALL')
  const [subsidiaryFilter, setSubsidiaryFilter] = useState<string>('ALL')
  const [stateFilter, setStateFilter] = useState<string>('ALL')
  const [complianceFilter, setComplianceFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  
  const [sortField, setSortField] = useState<string>('complianceScore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const subsidiaries = Array.from(new Set(mines.map(m => m.subsidiaryCode))).sort()
  const states = Array.from(new Set(mines.map(m => m.state))).sort()

  const getOpenCapaCount = (mineId: string) => {
    return capas.filter(c => c.mineId === mineId && c.status !== 'CLOSED').length
  }

  const filtered = useMemo(() => {
    let result = mines.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.code.toLowerCase().includes(search.toLowerCase()) ||
        m.subsidiary.toLowerCase().includes(search.toLowerCase()) ||
        m.location.toLowerCase().includes(search.toLowerCase())
      
      const matchType = typeFilter === 'ALL' || m.type === typeFilter
      const matchRisk = riskFilter === 'ALL' || m.riskLevel === riskFilter
      const matchSubsidiary = subsidiaryFilter === 'ALL' || m.subsidiaryCode === subsidiaryFilter
      const matchState = stateFilter === 'ALL' || m.state === stateFilter
      const matchStatus = statusFilter === 'ALL' || m.status === statusFilter
      
      let matchCompliance = true
      if (complianceFilter === 'HIGH') matchCompliance = m.complianceScore >= 80
      else if (complianceFilter === 'MEDIUM') matchCompliance = m.complianceScore >= 60 && m.complianceScore < 80
      else if (complianceFilter === 'LOW') matchCompliance = m.complianceScore < 60

      return matchSearch && matchType && matchRisk && matchSubsidiary && matchState && matchStatus && matchCompliance
    })

    result.sort((a, b) => {
      let aVal = a[sortField as keyof typeof a]
      let bVal = b[sortField as keyof typeof b]
      
      if (sortField === 'openCapa') {
        aVal = getOpenCapaCount(a.id) as any
        bVal = getOpenCapaCount(b.id) as any
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })

    return result
  }, [search, typeFilter, riskFilter, subsidiaryFilter, stateFilter, statusFilter, complianceFilter, sortField, sortDir])

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const ocCount = mines.filter((m) => m.type === 'OPENCAST').length
  const ugCount = mines.filter((m) => m.type === 'UNDERGROUND').length
  const highRiskCount = mines.filter((m) => m.riskLevel === 'HIGH').length

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-bold text-text-primary tracking-wide">Mines</h1>
        <p className="text-sm text-text-secondary">Monitor compliance, risk and operational status across monitored mines.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Monitored Mines" value={mines.length} icon={<Factory className="w-4 h-4" />} />
        <KPICard label="Opencast Mines" value={ocCount} />
        <KPICard label="Underground Mines" value={ugCount} />
        <KPICard label="High Risk Mines" value={highRiskCount} icon={<ShieldAlert className="w-4 h-4 text-red" />} />
      </div>

      {/* Filters */}
      <div className="bg-surface-raised border border-border rounded-md p-4 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search mines by name, code, subsidiary, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50"
            />
          </div>
          <select
            value={subsidiaryFilter}
            onChange={(e) => setSubsidiaryFilter(e.target.value)}
            className="px-3 py-2 bg-mine-black border border-border rounded text-[12px] text-text-secondary focus:outline-none focus:border-amber/50"
          >
            <option value="ALL">All Subsidiaries</option>
            {subsidiaries.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-2 bg-mine-black border border-border rounded text-[12px] text-text-secondary focus:outline-none focus:border-amber/50"
          >
            <option value="ALL">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-mine-black border border-border rounded text-[12px] text-text-secondary focus:outline-none focus:border-amber/50"
          >
            <option value="ALL">All Mine Types</option>
            <option value="OPENCAST">Opencast</option>
            <option value="UNDERGROUND">Underground</option>
            <option value="MIXED">Mixed</option>
          </select>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-mine-black border border-border rounded text-[12px] text-text-secondary focus:outline-none focus:border-amber/50"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
          <select
            value={complianceFilter}
            onChange={(e) => setComplianceFilter(e.target.value)}
            className="px-3 py-2 bg-mine-black border border-border rounded text-[12px] text-text-secondary focus:outline-none focus:border-amber/50"
          >
            <option value="ALL">All Compliance Levels</option>
            <option value="HIGH">High (≥80%)</option>
            <option value="MEDIUM">Medium (60-79%)</option>
            <option value="LOW">Low (&lt;60%)</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-mine-black border border-border rounded text-[12px] text-text-secondary focus:outline-none focus:border-amber/50"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <span className="text-[12px] text-text-muted ml-auto font-mono">
            Showing {filtered.length} of {mines.length}
          </span>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="bg-surface-raised border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-mine-black/80">
                {[
                  { key: 'code', label: 'Mine' },
                  { key: 'subsidiaryCode', label: 'Subsidiary' },
                  { key: 'location', label: 'Location' },
                  { key: 'type', label: 'Mine Type' },
                  { key: 'complianceScore', label: 'Compliance' },
                  { key: 'riskLevel', label: 'Risk' },
                  { key: 'openCapa', label: 'Open CAPA' },
                  { key: 'lastInspectionDate', label: 'Last Inspection' },
                  { key: 'status', label: 'Status' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-amber transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((mine) => (
                <tr
                  key={mine.id}
                  onClick={() => navigate(`/mines/${mine.id}`)}
                  className="hover:bg-mine-black/60 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-text-primary group-hover:text-amber transition-colors">{mine.name}</span>
                      <span className="text-[11px] font-mono text-amber-dim">{mine.code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{mine.subsidiaryCode}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[12px] text-text-secondary">{mine.location}</span>
                      <span className="text-[10px] text-text-muted">{mine.state}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-text-secondary bg-mine-black px-2 py-1 rounded border border-border">
                      {mine.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-mine-black rounded overflow-hidden">
                        <div
                          className={`h-full rounded ${mine.complianceScore >= 80 ? 'bg-green' : mine.complianceScore >= 60 ? 'bg-amber' : 'bg-red'}`}
                          style={{ width: `${mine.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-mono text-text-primary w-8">{mine.complianceScore}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={mine.riskLevel} /></td>
                  <td className="px-4 py-3">
                    <span className={`text-[12px] font-mono ${getOpenCapaCount(mine.id) > 0 ? 'text-amber' : 'text-text-muted'}`}>
                      {getOpenCapaCount(mine.id)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] font-mono text-text-secondary">{formatDate(mine.lastInspectionDate)}</td>
                  <td className="px-4 py-3"><StatusBadge status={mine.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[12px] text-amber hover:text-amber-light font-medium px-3 py-1 bg-amber/5 rounded transition-colors opacity-0 group-hover:opacity-100">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-[13px] text-text-muted">
                    No mines found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
