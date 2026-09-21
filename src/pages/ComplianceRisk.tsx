import { useState, useMemo } from 'react'
import { Search, ShieldAlert, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { StatusBadge } from '../components/shared/StatusBadge'
import { KPICard } from '../components/shared/KPICard'
import { complianceObligations } from '../data/compliance'

export default function ComplianceRisk() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')

  const categories = useMemo(
    () => ['ALL', ...new Set(complianceObligations.map((o) => o.category))],
    []
  )

  const filtered = useMemo(() => {
    return complianceObligations.filter((o) => {
      const matchSearch =
        o.description.toLowerCase().includes(search.toLowerCase()) ||
        o.clause.toLowerCase().includes(search.toLowerCase()) ||
        o.regulationName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'ALL' || o.status === statusFilter
      const matchCategory = categoryFilter === 'ALL' || o.category === categoryFilter
      return matchSearch && matchStatus && matchCategory
    })
  }, [search, statusFilter, categoryFilter])

  const compliant = complianceObligations.filter((o) => o.status === 'COMPLIANT').length
  const nonCompliant = complianceObligations.filter((o) => o.status === 'NON_COMPLIANT').length
  const partial = complianceObligations.filter((o) => o.status === 'PARTIALLY_COMPLIANT').length
  const review = complianceObligations.filter((o) => o.status === 'UNDER_REVIEW').length

  const statusChartData = [
    { status: 'Compliant', count: compliant, color: '#2E7D4F' },
    { status: 'Non-Compliant', count: nonCompliant, color: '#C1292E' },
    { status: 'Partial', count: partial, color: '#F0A202' },
    { status: 'Under Review', count: review, color: '#3B82F6' },
  ]

  const compliancePercent = Math.round((compliant / complianceObligations.length) * 100)

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard
          label="Compliance Score"
          value={`${compliancePercent}%`}
          subtitle={`${compliant} of ${complianceObligations.length}`}
          icon={<ShieldAlert className="w-4 h-4" />}
          variant={compliancePercent >= 80 ? 'success' : compliancePercent >= 60 ? 'warning' : 'danger'}
        />
        <KPICard label="Non-Compliant" value={nonCompliant} subtitle="obligations" variant="danger" />
        <KPICard label="Partially Compliant" value={partial} subtitle="obligations" variant="warning" />
        <KPICard label="Under Review" value={review} subtitle="obligations" />
      </div>

      {/* Chart + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="bg-surface-raised border border-border rounded p-4 lg:col-span-1">
          <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-3">OBLIGATION STATUS</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={100} />
              <Tooltip contentStyle={{ background: '#1C2530', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 2, 2, 0]}>
                {statusChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-text-muted mt-1">Sample data — Demo</p>
        </div>

        {/* Non-compliance highlights */}
        <div className="bg-surface-raised border border-border rounded p-4 lg:col-span-2">
          <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red" /> NON-COMPLIANT OBLIGATIONS
          </h3>
          <div className="space-y-3">
            {complianceObligations
              .filter((o) => o.status === 'NON_COMPLIANT')
              .map((o) => (
                <div key={o.id} className="p-3 bg-red-dim/30 border border-red/20 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status="HIGH" />
                    <span className="text-[10px] text-text-muted font-mono">{o.clause}</span>
                  </div>
                  <p className="text-[12px] text-text-primary">{o.description}</p>
                  <p className="text-[11px] text-text-muted mt-1">{o.regulationName} • {o.category} • {o.responsibleRole}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search obligations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface-raised border border-border rounded text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="COMPLIANT">Compliant</option>
          <option value="NON_COMPLIANT">Non-Compliant</option>
          <option value="PARTIALLY_COMPLIANT">Partially Compliant</option>
          <option value="UNDER_REVIEW">Under Review</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
          ))}
        </select>
        <span className="text-[12px] text-text-muted ml-auto">
          Showing {filtered.length} of {complianceObligations.length}
        </span>
      </div>

      {/* Obligations Table */}
      <div className="bg-surface-raised border border-border rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-mine-black/50">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Regulation</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Clause</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider max-w-[300px]">Description</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Risk</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Responsible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((obl) => (
                <tr key={obl.id} className="hover:bg-mine-black/50 transition-colors">
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{obl.regulationName}</td>
                  <td className="px-4 py-3 text-[12px] font-mono text-amber">{obl.clause}</td>
                  <td className="px-4 py-3 text-[12px] text-text-primary max-w-[300px]">
                    <p className="line-clamp-2">{obl.description}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{obl.category}</td>
                  <td className="px-4 py-3"><StatusBadge status={obl.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={obl.riskIfNonCompliant} /></td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{obl.responsibleRole}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
