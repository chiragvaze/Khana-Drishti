import { useState, useMemo, useEffect } from 'react'
import { Search, ShieldAlert, AlertTriangle, ArrowDown, Activity, CheckCircle, FileText, Zap, X } from 'lucide-react'
import { StatusBadge } from '../components/shared/StatusBadge'
import { KPICard } from '../components/shared/KPICard'
import { cn } from '../lib/utils'
import { useDemo } from '../contexts/DemoContext'
import DemoHighlight from '../components/shared/DemoHighlight'

// ----------------------------------------------------------------------
// Mock Data (Compliance Risk Engine)
// ----------------------------------------------------------------------
const mockRisks = [
  {
    id: 'KD-R102',
    mine: 'WCL-04',
    observation: 'Ventilation CAPA overdue',
    domain: 'Safety',
    riskLevel: 'HIGH',
    confidence: 94,
    obligation: 'CMR-2017 Ch-XI',
    status: 'OPEN',
    lastUpdated: '2026-09-22T08:30:00Z',
    evidence: 'System log shows CAPA #WCL04-VENT-001 is 72 hours overdue.',
    riskFactors: ['Methane concentration upward trend', 'Auxiliary fan failure rate high'],
    aiReasoning: 'Historical data shows 85% probability of incident when ventilation CAPAs are delayed >48h in this seam.',
    recommendedAction: 'Immediate DGMS escalation and halt of operations in Panel 3B.',
    propagation: [
      'Ventilation CAPA overdue',
      'Ventilation compliance risk',
      'Gas-related compliance weight',
      'Inspection priority increased'
    ]
  },
  {
    id: 'KD-R105',
    mine: 'BCCL-06',
    observation: 'FR cable installation delayed',
    domain: 'Electrical',
    riskLevel: 'HIGH',
    confidence: 88,
    obligation: 'CEA Reg-109',
    status: 'OPEN',
    lastUpdated: '2026-09-21T14:15:00Z',
    evidence: 'Field inspection photo shows standard PVC cables in main intake.',
    riskFactors: ['High voltage line proximity', 'Historical fire incidents'],
    aiReasoning: 'Non-FR cables in main intake pose critical fire propagation risk.',
    recommendedAction: 'Issue stoppage order for specific electrical section until FR cables are installed.',
    propagation: [
      'FR cable installation delayed',
      'Electrical fire risk elevated',
      'Overall mine safety score reduced',
      'Immediate contractor penalty'
    ]
  },
  {
    id: 'KD-R089',
    mine: 'NCL-12',
    observation: 'Slope movement detected',
    domain: 'Geotechnical',
    riskLevel: 'MEDIUM',
    confidence: 76,
    obligation: 'CMR-2017 Reg-106',
    status: 'MONITORING',
    lastUpdated: '2026-09-20T09:45:00Z',
    evidence: 'Prism monitoring data shows 2mm/day movement on South bench.',
    riskFactors: ['Post-monsoon saturation', 'Heavy machinery vibration'],
    aiReasoning: 'Movement rate is within acceptable limits but accelerating slightly.',
    recommendedAction: 'Increase monitoring frequency to 12-hourly and restrict heavy machinery near edge.',
    propagation: [
      'Slope movement detected',
      'Geotechnical stability alert',
      'Operational restriction applied',
      'Survey team dispatched'
    ]
  },
  {
    id: 'KD-R112',
    mine: 'SECL-07',
    observation: 'Dust suppression failure',
    domain: 'Environmental',
    riskLevel: 'LOW',
    confidence: 91,
    obligation: 'EP Act 1986',
    status: 'CLOSED',
    lastUpdated: '2026-09-19T16:20:00Z',
    evidence: 'Sensor PM10 readings exceeded limit for 4 hours.',
    riskFactors: ['Dry weather conditions', 'High truck traffic'],
    aiReasoning: 'Temporary failure of water sprinklers caused localized dust spike.',
    recommendedAction: 'Repair sprinkler pump and increase manual spraying.',
    propagation: [
      'Dust suppression failure',
      'Air quality index drop',
      'Environmental compliance warning',
      'CAPA issued to maintenance'
    ]
  }
]

export default function ComplianceRisk() {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<string>('ALL')
  const [domainFilter, setDomainFilter] = useState<string>('ALL')
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null)

  const { isActive: demoActive, currentStep } = useDemo()

  const domains = useMemo(() => ['ALL', ...new Set(mockRisks.map(r => r.domain))], [])

  // Auto-select WCL-04 Risk for Demo Step 5
  useEffect(() => {
    if (demoActive && currentStep === 5 && !selectedRiskId) {
      setSelectedRiskId('KD-R102')
    }
  }, [demoActive, currentStep, selectedRiskId])
  const filteredRisks = useMemo(() => {
    return mockRisks.filter(r => {
      const matchSearch = r.mine.toLowerCase().includes(search.toLowerCase()) || r.observation.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
      const matchRisk = riskFilter === 'ALL' || r.riskLevel === riskFilter
      const matchDomain = domainFilter === 'ALL' || r.domain === domainFilter
      return matchSearch && matchRisk && matchDomain
    })
  }, [search, riskFilter, domainFilter])

  const highRiskCount = mockRisks.filter(r => r.riskLevel === 'HIGH').length
  const medRiskCount = mockRisks.filter(r => r.riskLevel === 'MEDIUM').length
  const lowRiskCount = mockRisks.filter(r => r.riskLevel === 'LOW').length

  const selectedRisk = mockRisks.find(r => r.id === selectedRiskId)

  return (
    <div className="relative h-[calc(100vh-140px)] flex flex-col space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 flex-shrink-0">
        <KPICard label="HIGH RISK" value={highRiskCount} subtitle="Active critical risks" variant="danger" icon={<AlertTriangle className="w-4 h-4" />} />
        <KPICard label="MEDIUM RISK" value={medRiskCount} subtitle="Elevated warnings" variant="warning" icon={<ShieldAlert className="w-4 h-4" />} />
        <KPICard label="LOW RISK" value={lowRiskCount} subtitle="Minor deviations" variant="success" icon={<CheckCircle className="w-4 h-4" />} />
      </div>

      {/* Table Section */}
      <div className="flex-1 bg-surface-raised border border-border rounded flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center bg-mine-black/40">
          <h2 className="font-heading text-lg text-text-primary tracking-wide mr-4">RISK ENGINE</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search risks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50"
            />
          </div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-mine-black border border-border rounded text-[12px] text-text-secondary focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3 py-2 bg-mine-black border border-border rounded text-[12px] text-text-secondary focus:outline-none"
          >
            {domains.map(cat => (
              <option key={cat} value={cat}>{cat === 'ALL' ? 'All Domains' : cat}</option>
            ))}
          </select>
          <div className="ml-auto text-[11px] text-text-muted">
            Prototype Risk Model — Not scientifically validated.
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-mine-black/95 backdrop-blur z-10">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Risk ID</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Mine</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Observation</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Domain</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Risk Level</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Confidence</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Applicable Obligation</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredRisks.map((risk) => (
                <tr 
                  key={risk.id} 
                  onClick={() => setSelectedRiskId(risk.id)}
                  className="hover:bg-mine-black cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 text-[12px] font-mono text-amber font-medium">{risk.id}</td>
                  <td className="px-4 py-3 text-[12px] text-text-primary">{risk.mine}</td>
                  <td className="px-4 py-3 text-[12px] text-text-primary font-medium">{risk.observation}</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{risk.domain}</td>
                  <td className="px-4 py-3"><StatusBadge status={risk.riskLevel as any} /></td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary font-mono">{risk.confidence}%</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary font-mono">{risk.obligation}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider",
                      risk.status === 'OPEN' ? "bg-amber-dim text-amber border border-amber/20" :
                      risk.status === 'CLOSED' ? "bg-green-dim text-green border border-green/20" :
                      "bg-blue-900/30 text-blue-400 border border-blue-500/20"
                    )}>
                      {risk.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary font-mono">
                    {new Date(risk.lastUpdated).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRisks.length === 0 && (
            <div className="p-8 text-center text-text-muted">No risks match the current filters.</div>
          )}
        </div>
      </div>

      {/* Overlay Backdrop */}
      {selectedRisk && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSelectedRiskId(null)}
        />
      )}

      {/* Right Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 w-[550px] bg-surface-raised border-l border-border shadow-2xl transform transition-transform duration-300 z-50 flex flex-col",
          selectedRisk ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedRisk && (
          <>
            <div className="flex items-center justify-between p-5 border-b border-border bg-mine-black/50">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-xl text-text-primary tracking-wide">RISK DETAIL</h2>
                  <StatusBadge status={selectedRisk.riskLevel as any} />
                </div>
                <p className="text-[12px] font-mono text-text-muted mt-1">{selectedRisk.id} • {selectedRisk.mine}</p>
              </div>
              <button 
                onClick={() => setSelectedRiskId(null)}
                className="p-2 hover:bg-mine-black rounded transition-colors text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* WHY THIS WAS FLAGGED */}
              <DemoHighlight step={5} tooltip="The Compliance & Risk Engine breaks down exactly why WCL-04's risk score was elevated, linking evidence to statutory obligations.">
                <section>
                  <h3 className="font-heading text-[14px] font-semibold text-amber tracking-widest mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> WHY THIS WAS FLAGGED
                  </h3>
                  <div className="space-y-4 bg-mine-black border border-border p-5 rounded-lg">
                  <div>
                    <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Evidence</p>
                    <p className="text-[13px] text-text-primary bg-surface p-2 border border-border/50 rounded">{selectedRisk.evidence}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Observation</p>
                      <p className="text-[13px] font-medium text-text-primary">{selectedRisk.observation}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Applicable Obligation</p>
                      <p className="text-[13px] font-mono text-amber">{selectedRisk.obligation}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Risk Factors</p>
                    <ul className="list-disc list-inside text-[13px] text-text-secondary space-y-1">
                      {selectedRisk.riskFactors.map((rf, idx) => (
                        <li key={idx}>{rf}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex justify-between">
                      <span>AI Reasoning</span>
                      <span className="text-blue-400 font-mono">Confidence: {selectedRisk.confidence}%</span>
                    </p>
                    <p className="text-[13px] text-text-primary bg-blue-900/10 p-3 border border-blue-500/20 rounded-md">
                      {selectedRisk.aiReasoning}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Recommended Action</p>
                    <p className="text-[13px] font-semibold text-text-primary flex items-start gap-2">
                      <Zap className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                      {selectedRisk.recommendedAction}
                    </p>
                  </div>
                </div>
              </section>
              </DemoHighlight>

              {/* LOGICAL CHAIN */}
              <section>
                <h3 className="font-heading text-[14px] font-semibold text-text-secondary tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> REASONING CHAIN
                </h3>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full bg-surface-raised border border-border py-2 px-4 rounded text-center text-[12px] font-mono text-text-secondary">Evidence</div>
                  <ArrowDown className="w-4 h-4 text-border" />
                  <div className="w-full bg-surface-raised border border-border py-2 px-4 rounded text-center text-[12px] font-mono text-text-secondary">Observation</div>
                  <ArrowDown className="w-4 h-4 text-border" />
                  <div className="w-full bg-surface-raised border border-border py-2 px-4 rounded text-center text-[12px] font-mono text-amber">Obligation</div>
                  <ArrowDown className="w-4 h-4 text-border" />
                  <div className="w-full bg-surface-raised border border-blue-500/30 bg-blue-900/10 py-2 px-4 rounded text-center text-[12px] font-mono text-blue-400 font-semibold">Risk Engine</div>
                  <ArrowDown className="w-4 h-4 text-border" />
                  <div className="w-full bg-surface-raised border border-red/30 bg-red-dim py-2 px-4 rounded text-center text-[12px] font-mono text-red font-semibold">Risk</div>
                  <ArrowDown className="w-4 h-4 text-border" />
                  <div className="w-full bg-surface-raised border border-border py-2 px-4 rounded text-center text-[12px] font-mono text-text-primary">Action</div>
                </div>
              </section>

              {/* RISK PROPAGATION */}
              <section>
                <h3 className="font-heading text-[14px] font-semibold text-text-secondary tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> RISK PROPAGATION
                </h3>
                <div className="bg-mine-black border border-border rounded-lg p-5">
                  <div className="flex flex-col space-y-4">
                    {selectedRisk.propagation.map((step, idx) => (
                      <div key={idx} className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono",
                            idx === 0 ? "bg-surface border border-border text-text-secondary" :
                            idx === selectedRisk.propagation.length - 1 ? "bg-red-dim border border-red/30 text-red" :
                            "bg-amber-dim border border-amber/30 text-amber"
                          )}>
                            {idx + 1}
                          </div>
                          <span className={cn(
                            "text-[13px]",
                            idx === selectedRisk.propagation.length - 1 ? "font-semibold text-text-primary" : "text-text-secondary"
                          )}>
                            {step}
                          </span>
                        </div>
                        {idx < selectedRisk.propagation.length - 1 && (
                          <div className="w-px h-6 bg-border ml-3 my-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

            </div>
          </>
        )}
      </div>

    </div>
  )
}
