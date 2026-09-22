import { useState, useMemo } from 'react'
import { HardHat, Search, ShieldAlert, AlertTriangle, CheckCircle, Activity, FileText, X, Clock, ExternalLink } from 'lucide-react'
import { KPICard } from '../components/shared/KPICard'
import { cn } from '../lib/utils'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/ui/ToastProvider'
import { useDemo } from '../contexts/DemoContext'
import DemoHighlight from '../components/shared/DemoHighlight'
import { useEffect } from 'react'

// ----------------------------------------------------------------------
// Mock Data (Contractor Governance)
// ----------------------------------------------------------------------
const mockContractors = [
  {
    id: 'C-001',
    name: 'ABC Mining Services',
    mine: 'WCL-04',
    safetyScore: 72,
    attendance: '88%',
    capaClosure: '65%',
    incidents: 2,
    overallStatus: 'UNDER_REVIEW',
    activeCapas: [
      { id: 'KD-102', title: 'Unsafe ventilation condition' }
    ],
    timeline: [
      { date: '2026-09-20', event: 'Safety audit conducted (Score: 72%)' },
      { date: '2026-09-18', event: 'Incident reported: Minor equipment damage' },
      { date: '2026-09-15', event: 'CAPA KD-102 assigned' },
    ],
    observations: [
      'Consistent delays in closing ventilation CAPAs.',
      'PPE compliance at 92%, slightly below mine average.'
    ],
    breakdown: {
      training: 85,
      ppe: 92,
      equipment: 65,
      reporting: 70
    }
  },
  {
    id: 'C-002',
    name: 'ElecTech Corp',
    mine: 'BCCL-06',
    safetyScore: 58,
    attendance: '95%',
    capaClosure: '40%',
    incidents: 1,
    overallStatus: 'HIGH_RISK',
    activeCapas: [
      { id: 'KD-084', title: 'FR cable installation delayed' }
    ],
    timeline: [
      { date: '2026-09-21', event: 'Escalation raised for FR cable CAPA' },
      { date: '2026-09-15', event: 'Failed electrical compliance check' },
    ],
    observations: [
      'Critical delays in safety-critical electrical installations.',
      'Staff attendance is strong, but technical compliance is lacking.'
    ],
    breakdown: {
      training: 70,
      ppe: 95,
      equipment: 45,
      reporting: 55
    }
  },
  {
    id: 'C-003',
    name: 'GeoSys Ltd',
    mine: 'NCL-12',
    safetyScore: 94,
    attendance: '98%',
    capaClosure: '100%',
    incidents: 0,
    overallStatus: 'ACTIVE',
    activeCapas: [],
    timeline: [
      { date: '2026-09-17', event: 'CAPA KD-056 closed successfully' },
      { date: '2026-09-10', event: 'Quarterly compliance review passed' },
    ],
    observations: [
      'Excellent track record of timely maintenance.',
      'Proactive reporting of geotechnical issues.'
    ],
    breakdown: {
      training: 98,
      ppe: 100,
      equipment: 90,
      reporting: 95
    }
  },
  {
    id: 'C-004',
    name: 'Global Haulage',
    mine: 'SECL-07',
    safetyScore: 82,
    attendance: '91%',
    capaClosure: '80%',
    incidents: 0,
    overallStatus: 'ACTIVE',
    activeCapas: [
      { id: 'KD-115', title: 'Dust suppression failure' }
    ],
    timeline: [
      { date: '2026-09-21', event: 'Dust suppression CAPA assigned' },
      { date: '2026-09-01', event: 'Monthly environmental audit passed' },
    ],
    observations: [
      'Generally reliable, minor recent issue with dust suppression system.',
      'Driver fatigue management protocols are well implemented.'
    ],
    breakdown: {
      training: 80,
      ppe: 85,
      equipment: 75,
      reporting: 88
    }
  }
]

export default function Contractors() {
  const [search, setSearch] = useState('')
  const [mineFilter, setMineFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedContractorId, setSelectedContractorId] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const { isActive: demoActive, currentStep } = useDemo()

  useEffect(() => {
    if (demoActive && currentStep === 7 && !selectedContractorId) {
      setSelectedContractorId('C-001')
    }
  }, [demoActive, currentStep, selectedContractorId])

  const mines = useMemo(() => ['ALL', ...new Set(mockContractors.map(c => c.mine))], [])
  const statuses = useMemo(() => ['ALL', ...new Set(mockContractors.map(c => c.overallStatus))], [])

  const filtered = useMemo(() => {
    return mockContractors.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())
      const matchMine = mineFilter === 'ALL' || c.mine === mineFilter
      const matchStatus = statusFilter === 'ALL' || c.overallStatus === statusFilter
      return matchSearch && matchMine && matchStatus
    })
  }, [search, mineFilter, statusFilter])

  const totalContractors = mockContractors.length
  const underReviewCount = mockContractors.filter(c => c.overallStatus === 'UNDER_REVIEW').length
  const highRiskCount = mockContractors.filter(c => c.overallStatus === 'HIGH_RISK').length
  const pendingCapaCount = mockContractors.reduce((sum, c) => sum + c.activeCapas.length, 0)

  const selectedContractor = mockContractors.find(c => c.id === selectedContractorId)

  const handleCapaClick = (capaId: string) => {
    toast({ title: `Navigating to CAPA ${capaId}`, type: 'info' })
    navigate('/capa') // In a real app we'd pass state or URL params to open the specific CAPA
  }

  return (
    <div className="relative h-[calc(100vh-140px)] flex flex-col space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 flex-shrink-0">
        <KPICard label="TOTAL CONTRACTORS" value={totalContractors} subtitle="Across all mines" icon={<HardHat className="w-4 h-4" />} />
        <KPICard label="UNDER REVIEW" value={underReviewCount} subtitle="Performance watch" variant="warning" icon={<Clock className="w-4 h-4" />} />
        <KPICard label="HIGH RISK" value={highRiskCount} subtitle="Immediate attention" variant="danger" icon={<ShieldAlert className="w-4 h-4" />} />
        <KPICard label="PENDING CAPA" value={pendingCapaCount} subtitle="Active assignments" variant="warning" icon={<AlertTriangle className="w-4 h-4" />} />
      </div>

      <div className="flex-1 flex flex-col bg-surface-raised border border-border rounded overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center bg-mine-black/40 shrink-0">
          <h2 className="font-heading text-lg text-text-primary tracking-wide mr-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber" />
            CONTRACTOR GOVERNANCE
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search contractors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-mine-black border border-border rounded text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50"
            />
          </div>
          <select
            value={mineFilter}
            onChange={(e) => setMineFilter(e.target.value)}
            className="px-3 py-1.5 bg-mine-black border border-border rounded text-[12px] text-text-secondary focus:outline-none"
          >
            {mines.map(m => (
              <option key={m} value={m}>{m === 'ALL' ? 'All Mines' : m}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-mine-black border border-border rounded text-[12px] text-text-secondary focus:outline-none"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-mine-black/95 backdrop-blur z-10">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Contractor</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Mine</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Safety Score</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Attendance</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">CAPA Closure</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Incidents</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Overall Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((c) => (
                <tr 
                  key={c.id} 
                  onClick={() => setSelectedContractorId(c.id)}
                  className="hover:bg-mine-black cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3">
                    <p className="text-[12px] font-medium text-text-primary group-hover:text-amber transition-colors">{c.name}</p>
                    <p className="text-[10px] text-text-muted font-mono">{c.id}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{c.mine}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[12px] font-mono font-bold",
                      c.safetyScore >= 85 ? "text-green" : c.safetyScore >= 70 ? "text-amber" : "text-red"
                    )}>
                      {c.safetyScore}/100
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary font-mono">{c.attendance}</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary font-mono">{c.capaClosure}</td>
                  <td className="px-4 py-3 text-[12px] text-text-primary font-mono">{c.incidents}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider",
                      c.overallStatus === 'ACTIVE' ? "bg-green-dim text-green border border-green/20" :
                      c.overallStatus === 'HIGH_RISK' ? "bg-red-dim text-red border border-red/20" :
                      "bg-amber-dim text-amber border border-amber/20"
                    )}>
                      {c.overallStatus.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-10 text-center text-text-muted">No contractors match the current filters.</div>
          )}
        </div>
      </div>

      {/* Drawer Overlay */}
      {selectedContractor && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSelectedContractorId(null)}
        />
      )}

      {/* Right Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 w-[600px] bg-surface-raised border-l border-border shadow-2xl transform transition-transform duration-300 z-50 flex flex-col",
          selectedContractor ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedContractor && (
          <>
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-mine-black/50 shrink-0">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-xl text-text-primary tracking-wide">{selectedContractor.name}</h2>
                  <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider",
                      selectedContractor.overallStatus === 'ACTIVE' ? "bg-green-dim text-green border border-green/20" :
                      selectedContractor.overallStatus === 'HIGH_RISK' ? "bg-red-dim text-red border border-red/20" :
                      "bg-amber-dim text-amber border border-amber/20"
                    )}>
                      {selectedContractor.overallStatus.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[12px] font-mono text-text-muted mt-1">{selectedContractor.id} • Assigned to {selectedContractor.mine}</p>
              </div>
              <button 
                onClick={() => setSelectedContractorId(null)}
                className="p-2 hover:bg-mine-black rounded transition-colors text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DemoHighlight step={7} tooltip="Contractor safety scores and active CAPAs are linked to ensure full accountability across the supply chain.">
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Prototype Scorecard */}
              <section>
                <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-widest mb-1 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber" /> PROTOTYPE SCORECARD
                </h3>
                <p className="text-[10px] text-text-muted italic mb-4">Note: This model is for demonstrative purposes and is not scientifically validated.</p>
                
                <div className="bg-mine-black border border-border p-4 rounded-lg grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: 'Training Compliance', val: selectedContractor.breakdown.training },
                    { label: 'PPE Usage', val: selectedContractor.breakdown.ppe },
                    { label: 'Equipment Safety', val: selectedContractor.breakdown.equipment },
                    { label: 'Reporting Accuracy', val: selectedContractor.breakdown.reporting },
                  ].map(metric => (
                    <div key={metric.label}>
                      <div className="flex justify-between text-[11px] text-text-secondary uppercase tracking-wide mb-1">
                        <span>{metric.label}</span>
                        <span className="font-mono">{metric.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface rounded overflow-hidden">
                        <div 
                          className={cn("h-full rounded transition-all", metric.val >= 85 ? "bg-green" : metric.val >= 70 ? "bg-amber" : "bg-red")} 
                          style={{ width: `${metric.val}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Performance Overview Grid */}
              <section className="grid grid-cols-2 gap-4">
                <div className="bg-mine-black border border-border rounded p-4">
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex justify-between">
                    <span>Overall Safety Score</span>
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </p>
                  <p className={cn("text-2xl font-mono font-bold", selectedContractor.safetyScore >= 85 ? "text-green" : selectedContractor.safetyScore >= 70 ? "text-amber" : "text-red")}>
                    {selectedContractor.safetyScore}/100
                  </p>
                </div>
                <div className="bg-mine-black border border-border rounded p-4">
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex justify-between">
                    <span>Attendance Rate</span>
                    <Activity className="w-3.5 h-3.5" />
                  </p>
                  <p className="text-2xl font-mono font-bold text-text-primary">
                    {selectedContractor.attendance}
                  </p>
                </div>
                <div className="bg-mine-black border border-border rounded p-4">
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex justify-between">
                    <span>CAPA Closure</span>
                    <CheckCircle className="w-3.5 h-3.5" />
                  </p>
                  <p className="text-2xl font-mono font-bold text-text-primary">
                    {selectedContractor.capaClosure}
                  </p>
                </div>
                <div className="bg-mine-black border border-border rounded p-4">
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex justify-between">
                    <span>Incident History</span>
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </p>
                  <p className={cn("text-2xl font-mono font-bold", selectedContractor.incidents > 0 ? "text-red" : "text-green")}>
                    {selectedContractor.incidents}
                  </p>
                </div>
              </section>

              {/* Pending CAPAs */}
              <section>
                <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-widest mb-3">PENDING CAPAS</h3>
                {selectedContractor.activeCapas.length > 0 ? (
                  <div className="space-y-2">
                    {selectedContractor.activeCapas.map(capa => (
                      <div 
                        key={capa.id} 
                        onClick={() => handleCapaClick(capa.id)}
                        className="flex items-center justify-between bg-amber-dim/20 border border-amber/30 rounded p-3 cursor-pointer hover:bg-amber-dim/40 transition-colors group"
                      >
                        <div>
                          <p className="text-[11px] font-mono text-amber font-bold">{capa.id}</p>
                          <p className="text-[13px] text-text-primary">{capa.title}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-amber opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[12px] text-text-muted italic bg-surface p-4 border border-border rounded text-center">
                    No active CAPAs assigned.
                  </div>
                )}
              </section>

              {/* Observations & Timeline */}
              <div className="grid grid-cols-2 gap-6">
                <section>
                  <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-widest mb-3">OBSERVATIONS</h3>
                  <ul className="space-y-2">
                    {selectedContractor.observations.map((obs, i) => (
                      <li key={i} className="flex gap-2 text-[12px] text-text-primary bg-mine-black p-3 border border-border rounded">
                        <FileText className="w-4 h-4 text-text-muted shrink-0" />
                        <span>{obs}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-widest mb-3">COMPLIANCE TIMELINE</h3>
                  <div className="relative border-l border-border ml-2 space-y-4">
                    {selectedContractor.timeline.map((event, i) => (
                      <div key={i} className="relative pl-4">
                        <div className="absolute w-2 h-2 rounded-full bg-border -left-[4.5px] top-1.5" />
                        <p className="text-[12px] text-text-primary">{event.event}</p>
                        <p className="text-[10px] font-mono text-text-muted mt-0.5">{event.date}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              </div>
            </DemoHighlight>
          </>
        )}
      </div>
    </div>
  )
}
