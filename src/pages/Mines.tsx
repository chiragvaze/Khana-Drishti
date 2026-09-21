import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Factory, Search, ArrowUpDown } from 'lucide-react'
import { StatusBadge } from '../components/shared/StatusBadge'
import { KPICard } from '../components/shared/KPICard'
import { mines } from '../data/mines'
import { formatDate } from '../lib/utils'

export default function Mines() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [riskFilter, setRiskFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('complianceScore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = useMemo(() => {
    let result = mines.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.code.toLowerCase().includes(search.toLowerCase()) ||
        m.subsidiary.toLowerCase().includes(search.toLowerCase()) ||
        m.location.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'ALL' || m.type === typeFilter
      const matchRisk = riskFilter === 'ALL' || m.riskLevel === riskFilter
      return matchSearch && matchType && matchRisk
    })

    result.sort((a, b) => {
      const aVal = a[sortField as keyof typeof a]
      const bVal = b[sortField as keyof typeof b]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })

    return result
  }, [search, typeFilter, riskFilter, sortField, sortDir])

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
  const mixedCount = mines.filter((m) => m.type === 'MIXED').length

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Mines" value={mines.length} icon={<Factory className="w-4 h-4" />} />
        <KPICard label="Opencast" value={ocCount} subtitle="mines" />
        <KPICard label="Underground" value={ugCount} subtitle="mines" />
        <KPICard label="Mixed" value={mixedCount} subtitle="mines" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search mines by name, code, subsidiary, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface-raised border border-border rounded text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none focus:border-amber/50"
        >
          <option value="ALL">All Types</option>
          <option value="OPENCAST">Opencast</option>
          <option value="UNDERGROUND">Underground</option>
          <option value="MIXED">Mixed</option>
        </select>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none focus:border-amber/50"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="HIGH">High Risk</option>
          <option value="MEDIUM">Medium Risk</option>
          <option value="LOW">Low Risk</option>
        </select>
        <span className="text-[12px] text-text-muted ml-auto">
          Showing {filtered.length} of {mines.length} mines
        </span>
      </div>

      {/* Table */}
      <div className="bg-surface-raised border border-border rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-mine-black/50">
                {[
                  { key: 'code', label: 'Code' },
                  { key: 'name', label: 'Mine Name' },
                  { key: 'subsidiary', label: 'Subsidiary' },
                  { key: 'type', label: 'Type' },
                  { key: 'location', label: 'Location' },
                  { key: 'status', label: 'Status' },
                  { key: 'complianceScore', label: 'Compliance' },
                  { key: 'riskLevel', label: 'Risk' },
                  { key: 'lastInspectionDate', label: 'Last Inspection' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((mine) => (
                <tr
                  key={mine.id}
                  onClick={() => navigate(`/mines/${mine.id}`)}
                  className="hover:bg-mine-black/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-[12px] font-mono font-medium text-amber">{mine.code}</td>
                  <td className="px-4 py-3 text-[12px] font-medium text-text-primary">{mine.name}</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{mine.subsidiaryCode}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-text-secondary">{mine.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{mine.location}</td>
                  <td className="px-4 py-3"><StatusBadge status={mine.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-mine-black rounded overflow-hidden">
                        <div
                          className={`h-full rounded ${mine.complianceScore >= 80 ? 'bg-green' : mine.complianceScore >= 60 ? 'bg-amber' : 'bg-red'}`}
                          style={{ width: `${mine.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-mono text-text-primary">{mine.complianceScore}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={mine.riskLevel} /></td>
                  <td className="px-4 py-3 text-[12px] font-mono text-text-secondary">{formatDate(mine.lastInspectionDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
