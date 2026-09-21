import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  MapPin, Users, Pickaxe, ShieldAlert, ArrowLeft,
  ClipboardCheck, AlertTriangle, Brain, Activity,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { StatusBadge } from '../components/shared/StatusBadge'
import { mines } from '../data/mines'
import { inspections } from '../data/inspections'
import { observations } from '../data/observations'
import { capas } from '../data/capas'
import { formatDate } from '../lib/utils'

const tabs = ['Overview', 'Inspections', 'Observations', 'CAPAs']

export default function MineDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')

  const mine = mines.find((m) => m.id === id)
  if (!mine) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <p className="text-lg">Mine not found</p>
        <button onClick={() => navigate('/mines')} className="mt-4 text-amber hover:text-amber-light text-sm">
          ← Back to Mines
        </button>
      </div>
    )
  }

  const mineInspections = inspections.filter((i) => i.mineId === mine.id)
  const mineObservations = observations.filter((o) => o.mineId === mine.id)
  const mineCAPAs = capas.filter((c) => c.mineId === mine.id)

  const complianceData = [
    { name: 'Compliant', value: mine.complianceScore, color: '#2E7D4F' },
    { name: 'Non-Compliant', value: 100 - mine.complianceScore, color: '#C1292E' },
  ]

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <button onClick={() => navigate('/mines')} className="text-[12px] text-text-muted hover:text-text-secondary flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Mines
      </button>

      <div className="bg-surface-raised border border-border rounded p-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-amber font-bold text-[16px]">{mine.code}</span>
              <h2 className="font-heading text-[22px] font-bold text-text-primary tracking-wide">{mine.name}</h2>
              <StatusBadge status={mine.status} size="md" />
              <StatusBadge status={mine.riskLevel} size="md" />
            </div>
            <p className="text-[13px] text-text-secondary">{mine.subsidiary}</p>
          </div>
          <div className="flex gap-6 text-[12px]">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <MapPin className="w-3.5 h-3.5" /> {mine.location}, {mine.state}
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Users className="w-3.5 h-3.5" /> {mine.totalWorkers} workers
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Pickaxe className="w-3.5 h-3.5" /> {mine.annualProductionMT} MT/year
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5 pt-5 border-t border-border">
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Type</span>
            <p className="text-[13px] font-medium text-text-primary mt-0.5">{mine.type.replace('_', ' ')}</p>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Area</span>
            <p className="text-[13px] font-medium text-text-primary mt-0.5">{mine.area}</p>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Compliance</span>
            <p className={`text-[13px] font-mono font-bold mt-0.5 ${mine.complianceScore >= 80 ? 'text-green' : mine.complianceScore >= 60 ? 'text-amber' : 'text-red'}`}>
              {mine.complianceScore}%
            </p>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Last Inspection</span>
            <p className="text-[13px] font-mono text-text-primary mt-0.5">{formatDate(mine.lastInspectionDate)}</p>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">District</span>
            <p className="text-[13px] text-text-primary mt-0.5">{mine.district}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-[12px] font-medium transition-colors relative ${
              activeTab === tab
                ? 'text-amber'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab}
            {tab === 'Observations' && mineObservations.length > 0 && (
              <span className="ml-1 text-[10px] font-mono">({mineObservations.length})</span>
            )}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Compliance Gauge */}
          <div className="bg-surface-raised border border-border rounded p-4">
            <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-3">COMPLIANCE SCORE</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={complianceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" startAngle={90} endAngle={-270}>
                  {complianceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1C2530', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center font-mono text-2xl font-bold text-text-primary -mt-4">{mine.complianceScore}%</p>
            <p className="text-[10px] text-text-muted text-center mt-1">Sample data — Demo</p>
          </div>

          {/* Quick Stats */}
          <div className="bg-surface-raised border border-border rounded p-4 space-y-4">
            <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider">SUMMARY</h3>
            <StatRow icon={<ClipboardCheck className="w-4 h-4 text-amber" />} label="Total Inspections" value={String(mineInspections.length)} />
            <StatRow icon={<AlertTriangle className="w-4 h-4 text-red" />} label="High-Risk Observations" value={String(mineObservations.filter(o => o.riskLevel === 'HIGH').length)} />
            <StatRow icon={<ShieldAlert className="w-4 h-4 text-amber" />} label="Open CAPAs" value={String(mineCAPAs.filter(c => c.status !== 'CLOSED').length)} />
            <StatRow icon={<Brain className="w-4 h-4 text-green" />} label="AI Verified Issues" value={String(mineObservations.filter(o => o.aiVerified).length)} />
          </div>

          {/* Recent Activity */}
          <div className="bg-surface-raised border border-border rounded p-4">
            <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-3">RECENT ACTIVITY</h3>
            <div className="space-y-3">
              {mineInspections.slice(0, 3).map((insp) => (
                <div key={insp.id} className="flex items-start gap-2 p-2 rounded hover:bg-mine-black/50 transition-colors">
                  <Activity className="w-3.5 h-3.5 text-amber mt-0.5" />
                  <div>
                    <p className="text-[12px] text-text-primary">{insp.type.replace('_', ' ')} Inspection</p>
                    <p className="text-[11px] text-text-muted">{formatDate(insp.date)} • {insp.inspector}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Inspections' && (
        <div className="bg-surface-raised border border-border rounded overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-mine-black/50">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Inspector</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Observations</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mineInspections.map((insp) => (
                <tr key={insp.id} className="hover:bg-mine-black/50 transition-colors">
                  <td className="px-4 py-3 text-[12px] font-mono text-amber">{insp.id.slice(-8)}</td>
                  <td className="px-4 py-3 text-[12px] font-mono text-text-primary">{formatDate(insp.date)}</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{insp.inspector}</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{insp.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3"><StatusBadge status={insp.status} /></td>
                  <td className="px-4 py-3 text-[12px] font-mono text-text-primary">
                    {insp.observationsCount}
                    {insp.highRiskCount > 0 && <span className="text-red ml-1">({insp.highRiskCount} high)</span>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={insp.riskLevel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Observations' && (
        <div className="space-y-3">
          {mineObservations.map((obs) => (
            <div key={obs.id} className="bg-surface-raised border border-border rounded p-4 hover:border-border-light transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={obs.riskLevel} />
                    <StatusBadge status={obs.status} />
                    <span className="text-[10px] text-text-muted font-mono">{obs.type}</span>
                  </div>
                  <h4 className="text-[13px] font-medium text-text-primary mt-1">{obs.title}</h4>
                  <p className="text-[12px] text-text-secondary mt-1 leading-relaxed">{obs.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-text-muted">
                    <span>{obs.regulationRef}</span>
                    <span>•</span>
                    <span>{obs.regulationClause}</span>
                  </div>
                </div>
                {obs.aiVerified && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-dim rounded text-[10px] text-green-light">
                    <Brain className="w-3 h-3" /> AI {obs.aiConfidence}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'CAPAs' && (
        <div className="space-y-3">
          {mineCAPAs.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-[13px]">No CAPAs for this mine</div>
          ) : (
            mineCAPAs.map((capa) => (
              <div key={capa.id} className="bg-surface-raised border border-border rounded p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={capa.priority} />
                      <StatusBadge status={capa.status} />
                    </div>
                    <h4 className="text-[13px] font-medium text-text-primary mt-1">{capa.title}</h4>
                    <p className="text-[12px] text-text-secondary mt-1">{capa.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-1.5 bg-mine-black rounded overflow-hidden">
                    <div
                      className={`h-full rounded ${capa.status === 'OVERDUE' ? 'bg-red' : 'bg-amber'}`}
                      style={{ width: `${capa.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-text-secondary">{capa.progressPercent}%</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-text-muted">
                  <span>Contractor: {capa.assignedContractor}</span>
                  <span>Due: {formatDate(capa.dueDate)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[12px] text-text-secondary">{label}</span>
      </div>
      <span className="font-mono text-[14px] font-bold text-text-primary">{value}</span>
    </div>
  )
}
