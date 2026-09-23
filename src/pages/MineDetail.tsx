import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  MapPin, Users, Pickaxe, ShieldAlert, ArrowLeft,
  ClipboardCheck, Brain, Activity,
  FileText, Image as ImageIcon,
  CheckCircle, HardHat, FileSearch
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { StatusBadge } from '../components/shared/StatusBadge'
import { mines } from '../data/mines'
import { inspections } from '../data/inspections'
import { observations } from '../data/observations'
import { capas } from '../data/capas'
import { formatDate } from '../lib/utils'

const tabs = ['Overview', 'Compliance', 'Inspections', 'Observations', 'CAPAs', 'Contractors', 'Evidence']

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

  const openObsCount = mineObservations.filter(o => o.status !== 'RESOLVED').length
  const overdueCapaCount = mineCAPAs.filter(c => c.status === 'OVERDUE').length

  const isWcl04Demo = mine.id === 'mine-wcl-04'

  return (
    <div className="space-y-6 pb-12">
      {/* Back + Header */}
      <button onClick={() => navigate('/mines')} className="text-[12px] text-text-muted hover:text-amber transition-colors flex items-center gap-1 w-fit">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Mines
      </button>

      <div className="bg-surface-raised border border-border rounded-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-2 py-1 bg-mine-black border border-border rounded text-amber font-mono font-bold text-[13px]">{mine.code}</span>
              <h2 className="font-heading text-2xl font-bold text-text-primary tracking-wide">{mine.name}</h2>
              <StatusBadge status={mine.status} size="md" />
              <StatusBadge status={mine.riskLevel} size="md" />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-text-secondary">
              <span className="font-medium">{mine.subsidiary} ({mine.subsidiaryCode})</span>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-text-muted" /> {mine.location}, {mine.state}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-6 text-[13px] bg-mine-black/50 p-3 sm:p-4 rounded border border-border">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-muted uppercase tracking-wider flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Workforce</span>
              <span className="font-medium text-text-primary">{mine.totalWorkers}</span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-muted uppercase tracking-wider flex items-center gap-1.5"><Pickaxe className="w-3.5 h-3.5" /> Annual Prod.</span>
              <span className="font-medium text-text-primary">{mine.annualProductionMT} MT</span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-muted uppercase tracking-wider">Type</span>
              <span className="font-medium text-text-primary">{mine.type.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <span className="text-[11px] text-text-muted uppercase tracking-wider">Compliance Score</span>
            <p className={`text-xl font-mono font-bold mt-1 ${mine.complianceScore >= 80 ? 'text-green' : mine.complianceScore >= 60 ? 'text-amber' : 'text-red'}`}>
              {mine.complianceScore}%
            </p>
          </div>
          <div>
            <span className="text-[11px] text-text-muted uppercase tracking-wider">Open Observations</span>
            <p className="text-xl font-mono font-bold text-text-primary mt-1">{openObsCount}</p>
          </div>
          <div>
            <span className="text-[11px] text-text-muted uppercase tracking-wider">Overdue CAPA</span>
            <p className={`text-xl font-mono font-bold mt-1 ${overdueCapaCount > 0 ? 'text-red' : 'text-text-primary'}`}>
              {overdueCapaCount}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-text-muted uppercase tracking-wider">Last Inspection</span>
            <p className="text-lg font-mono text-text-primary mt-1.5">{formatDate(mine.lastInspectionDate)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto scrollbar-hide pb-px">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab
                ? 'text-amber'
                : 'text-text-muted hover:text-text-secondary hover:bg-surface-raised'
            }`}
          >
            {tab}
            {tab === 'Observations' && mineObservations.length > 0 && (
              <span className="ml-1.5 text-[10px] font-mono py-0.5 px-1.5 rounded-full bg-mine-black border border-border">
                {mineObservations.length}
              </span>
            )}
            {tab === 'CAPAs' && mineCAPAs.length > 0 && (
              <span className="ml-1.5 text-[10px] font-mono py-0.5 px-1.5 rounded-full bg-mine-black border border-border">
                {mineCAPAs.length}
              </span>
            )}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Stats & Drivers */}
            <div className="space-y-6">
              <div className="bg-surface-raised border border-border rounded-md p-5">
                <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  COMPLIANCE HEALTH
                </h3>
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={complianceData} cx="50%" cy="50%" innerRadius={60} outerRadius={75} dataKey="value" startAngle={90} endAngle={-270} stroke="none">
                        {complianceData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#111822', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute mt-16 text-center">
                    <p className="font-mono text-3xl font-bold text-text-primary">{mine.complianceScore}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-raised border border-border rounded-md p-5">
                <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red" />
                  KEY RISK DRIVERS
                </h3>
                <ul className="space-y-3">
                  {isWcl04Demo ? (
                    <>
                      <li className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-red mt-1.5 shrink-0" />
                        <p className="text-[13px] text-text-primary leading-relaxed">
                          Overdue ventilation CAPA in underground Panel 3B indicating prolonged non-compliance.
                        </p>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber mt-1.5 shrink-0" />
                        <p className="text-[13px] text-text-primary leading-relaxed">
                          Missing daily environmental telemetry evidence for 3 continuous shifts.
                        </p>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber mt-1.5 shrink-0" />
                        <p className="text-[13px] text-text-primary leading-relaxed">
                          Contractor safety observation open for &gt; 15 days.
                        </p>
                      </li>
                    </>
                  ) : (
                    <li className="text-[13px] text-text-muted italic">No critical risk drivers identified.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Middle/Right Column: Risk Explanation (WCL-04 Demo) or General Activity */}
            <div className="lg:col-span-2 space-y-6">
              {isWcl04Demo ? (
                <div className="bg-surface-raised border border-border rounded-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading text-[14px] font-semibold text-text-primary tracking-wider flex items-center gap-2">
                      <Brain className="w-4 h-4 text-amber" />
                      AI RISK CLASSIFICATION CHAIN
                    </h3>
                    <StatusBadge status="HIGH" />
                  </div>
                  
                  <div className="bg-mine-black border border-border rounded-md p-5 mb-6">
                    <h4 className="text-[15px] font-semibold text-red-light mb-2">Unsafe ventilation condition detected</h4>
                    <p className="text-[13px] text-text-secondary leading-relaxed">
                      AI systems detected a critical safety pattern combining low air velocity readings from telemetry and visual evidence of damaged ventilation ducting in Panel 3B.
                    </p>
                  </div>

                  <div className="relative">
                    {/* Vertical connecting line */}
                    <div className="absolute left-6 top-6 bottom-6 w-px bg-border" />

                    <div className="space-y-6">
                      {/* Step 1: Evidence */}
                      <div className="relative flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-mine-black border border-border flex items-center justify-center shrink-0 z-10">
                          <ImageIcon className="w-5 h-5 text-text-muted" />
                        </div>
                        <div className="flex-1 bg-mine-black/50 border border-border rounded p-4">
                          <div className="text-[10px] text-text-muted font-mono mb-1">STEP 1 : EVIDENCE UPLOADED</div>
                          <h5 className="text-[13px] font-medium text-text-primary mb-1">Damaged Ventilation Ducting (Photo + Sensor)</h5>
                          <p className="text-[12px] text-text-secondary">Inspector uploaded field photo showing 1.5m tear in flexible ducting at Station 4+200. Correlated with telemetry reading of 0.3 m/s air velocity.</p>
                        </div>
                      </div>

                      {/* Step 2: Observation */}
                      <div className="relative flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-mine-black border border-amber/30 flex items-center justify-center shrink-0 z-10">
                          <FileSearch className="w-5 h-5 text-amber" />
                        </div>
                        <div className="flex-1 bg-amber/5 border border-amber/20 rounded p-4">
                          <div className="text-[10px] text-amber-dim font-mono mb-1">STEP 2 : AI OBSERVATION CREATED</div>
                          <h5 className="text-[13px] font-medium text-amber-light mb-1">Ventilation effectiveness compromised</h5>
                          <p className="text-[12px] text-text-secondary">Vision AI confirmed duct tear. Data AI correlated low velocity with risk of methane buildup at the working face.</p>
                        </div>
                      </div>

                      {/* Step 3: Obligation */}
                      <div className="relative flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-mine-black border border-border flex items-center justify-center shrink-0 z-10">
                          <FileText className="w-5 h-5 text-text-muted" />
                        </div>
                        <div className="flex-1 bg-mine-black/50 border border-border rounded p-4">
                          <div className="text-[10px] text-text-muted font-mono mb-1">STEP 3 : REGULATORY MAPPING</div>
                          <h5 className="text-[13px] font-medium text-text-primary mb-1">Coal Mines Regulations 2017, Reg. 130</h5>
                          <p className="text-[12px] text-text-secondary">System mapped observation to statutory requirement: Minimum 1.0 m/s air velocity must be maintained in the return airway.</p>
                        </div>
                      </div>

                      {/* Step 4: Classification */}
                      <div className="relative flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-red/10 border border-red/30 flex items-center justify-center shrink-0 z-10">
                          <ShieldAlert className="w-5 h-5 text-red" />
                        </div>
                        <div className="flex-1 bg-red/5 border border-red/20 rounded p-4">
                          <div className="text-[10px] text-red-dim font-mono mb-1">STEP 4 : RISK CLASSIFIED</div>
                          <h5 className="text-[13px] font-medium text-red-light mb-1">HIGH RISK ASSIGNED</h5>
                          <p className="text-[12px] text-text-secondary">Due to direct violation of CMR 2017 Reg. 130 and presence of methane hazard, the issue was automatically escalated to HIGH risk and DGMS notified.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-raised border border-border rounded-md p-5">
                  <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-4">RECENT INSPECTIONS</h3>
                  <div className="space-y-3">
                    {mineInspections.slice(0, 5).map((insp) => (
                      <div key={insp.id} className="flex items-start justify-between gap-4 p-3 bg-mine-black rounded border border-border">
                        <div className="flex gap-3">
                          <ClipboardCheck className="w-4 h-4 text-text-muted mt-0.5" />
                          <div>
                            <p className="text-[13px] text-text-primary font-medium">{insp.type.replace('_', ' ')} Inspection</p>
                            <p className="text-[11px] text-text-secondary mt-1">{insp.inspector} • {formatDate(insp.date)}</p>
                          </div>
                        </div>
                        <StatusBadge status={insp.riskLevel} />
                      </div>
                    ))}
                    {mineInspections.length === 0 && (
                      <p className="text-[13px] text-text-muted py-4 text-center">No recent inspections.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other Tabs Content */}
        {activeTab === 'Compliance' && (
          <div className="bg-surface-raised border border-border rounded-md p-10 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-12 h-12 text-text-muted mb-4 opacity-50" />
            <h3 className="text-[15px] font-medium text-text-primary mb-2">Compliance History Module</h3>
            <p className="text-[13px] text-text-secondary max-w-md">Detailed statutory compliance mapping and historical scoring trends will be available here.</p>
          </div>
        )}

        {activeTab === 'Inspections' && (
          <div className="bg-surface-raised border border-border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-border bg-mine-black/80">
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
          </div>
        )}

        {activeTab === 'Observations' && (
          <div className="space-y-4">
            {mineObservations.map((obs) => (
              <div key={obs.id} className="bg-surface-raised border border-border rounded-md p-5 hover:border-amber/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={obs.riskLevel} />
                      <StatusBadge status={obs.status} />
                      <span className="text-[10px] text-text-muted font-mono bg-mine-black px-2 py-0.5 rounded border border-border">{obs.type}</span>
                    </div>
                    <h4 className="text-[14px] font-semibold text-text-primary">{obs.title}</h4>
                    <p className="text-[13px] text-text-secondary leading-relaxed max-w-4xl">{obs.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-text-muted font-mono bg-mine-black/50 w-fit px-3 py-1.5 rounded border border-border">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{obs.regulationRef}</span>
                      <span>—</span>
                      <span className="text-amber-dim">{obs.regulationClause}</span>
                    </div>
                  </div>
                  {obs.aiVerified && (
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green/10 border border-green/20 rounded text-[11px] text-green-light font-medium">
                        <Brain className="w-3.5 h-3.5" /> AI Verified ({obs.aiConfidence}%)
                      </div>
                      <span className="text-[10px] text-text-muted font-mono">{obs.dateIdentified}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'CAPAs' && (
          <div className="space-y-4">
            {mineCAPAs.length === 0 ? (
              <div className="text-center py-12 text-text-muted text-[13px]">No CAPAs for this mine</div>
            ) : (
              mineCAPAs.map((capa) => (
                <div key={capa.id} className="bg-surface-raised border border-border rounded-md p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={capa.priority} />
                        <StatusBadge status={capa.status} />
                      </div>
                      <h4 className="text-[14px] font-semibold text-text-primary">{capa.title}</h4>
                      <p className="text-[13px] text-text-secondary max-w-4xl leading-relaxed">{capa.description}</p>
                    </div>
                  </div>
                  <div className="bg-mine-black border border-border rounded p-4 space-y-3">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-text-muted">Progress ({capa.progressPercent}%)</span>
                      <span className="text-text-muted">Due: <span className="font-mono text-text-primary">{formatDate(capa.dueDate)}</span></span>
                    </div>
                    <div className="w-full h-2 bg-surface-raised rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${capa.status === 'OVERDUE' ? 'bg-red' : capa.progressPercent === 100 ? 'bg-green' : 'bg-amber'}`}
                        style={{ width: `${capa.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-text-secondary pt-2">
                      <HardHat className="w-4 h-4 text-text-muted" />
                      Assigned to: <span className="text-amber-dim font-medium">{capa.assignedContractor}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'Contractors' && (
          <div className="bg-surface-raised border border-border rounded-md p-10 flex flex-col items-center justify-center text-center">
            <HardHat className="w-12 h-12 text-text-muted mb-4 opacity-50" />
            <h3 className="text-[15px] font-medium text-text-primary mb-2">Contractor Safety Profiles</h3>
            <p className="text-[13px] text-text-secondary max-w-md">Detailed performance metrics, safety incidents, and clearance statuses for all active contractors at this mine.</p>
          </div>
        )}

        {activeTab === 'Evidence' && (
          <div className="bg-surface-raised border border-border rounded-md p-10 flex flex-col items-center justify-center text-center">
            <ImageIcon className="w-12 h-12 text-text-muted mb-4 opacity-50" />
            <h3 className="text-[15px] font-medium text-text-primary mb-2">Evidence Vault</h3>
            <p className="text-[13px] text-text-secondary max-w-md">Central repository for inspection photos, videos, drone footage, and IoT telemetry data logs.</p>
          </div>
        )}

      </div>
    </div>
  )
}
