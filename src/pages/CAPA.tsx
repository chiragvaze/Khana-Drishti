import { useState, useMemo, useEffect } from 'react'
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle, Search, ShieldAlert, User, Paperclip, Activity, X } from 'lucide-react'
import { StatusBadge } from '../components/shared/StatusBadge'
import { KPICard } from '../components/shared/KPICard'
import { cn } from '../lib/utils'
import { useToast } from '../components/ui/ToastProvider'
import { useDemo } from '../contexts/DemoContext'
import DemoHighlight from '../components/shared/DemoHighlight'

// ----------------------------------------------------------------------
// Mock Data (CAPA Management)
// ----------------------------------------------------------------------
type CapaStatus = 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'CLOSED'

interface TimelineStep {
  id: string
  label: string
  completed: boolean
}

interface ActivityItem {
  timestamp: string
  desc: string
}

interface MockCapa {
  id: string
  observation: string
  mine: string
  risk: string
  owner: string
  slaHours: number
  status: CapaStatus
  created: string
  due: Date
  timeline: TimelineStep[]
  evidence: { name: string, type: string }[]
  activities: ActivityItem[]
}

const now = new Date()
const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000 - 1500000) // ~23.5 hours left
const yesterday = new Date(now.getTime() - 24 * 3600 * 1000)
const nextWeek = new Date(now.getTime() + 7 * 24 * 3600 * 1000)
const today = new Date(now.getTime() + 4 * 3600 * 1000) // Due in 4 hours

const initialCapas: MockCapa[] = [
  {
    id: 'KD-102',
    observation: 'Unsafe ventilation condition',
    mine: 'WCL-04',
    risk: 'HIGH',
    owner: 'ABC Mining Services',
    slaHours: 24,
    status: 'OPEN',
    created: yesterday.toISOString(),
    due: tomorrow,
    timeline: [
      { id: 't1', label: 'Observation raised', completed: true },
      { id: 't2', label: 'Owner assigned', completed: true },
      { id: 't3', label: 'Notification sent', completed: true },
      { id: 't4', label: 'Corrective action started', completed: false },
      { id: 't5', label: 'Evidence requested', completed: false },
      { id: 't6', label: 'Closure pending', completed: false },
    ],
    evidence: [],
    activities: [
      { timestamp: yesterday.toISOString(), desc: 'Observation recorded during inspection.' },
      { timestamp: new Date(yesterday.getTime() + 3600000).toISOString(), desc: 'Assigned to ABC Mining Services.' }
    ]
  },
  {
    id: 'KD-084',
    observation: 'FR cable installation delayed',
    mine: 'BCCL-06',
    risk: 'HIGH',
    owner: 'ElecTech Corp',
    slaHours: 48,
    status: 'ESCALATED',
    created: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString(),
    due: today,
    timeline: [
      { id: 't1', label: 'Observation raised', completed: true },
      { id: 't2', label: 'Owner assigned', completed: true },
      { id: 't3', label: 'Notification sent', completed: true },
      { id: 't4', label: 'Corrective action started', completed: true },
      { id: 't5', label: 'Evidence requested', completed: true },
      { id: 't6', label: 'Closure pending', completed: false },
    ],
    evidence: [{ name: 'cable_spec.pdf', type: 'DOCUMENT' }],
    activities: [
      { timestamp: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(), desc: 'Escalated due to SLA breach imminent.' }
    ]
  },
  {
    id: 'KD-115',
    observation: 'Dust suppression failure',
    mine: 'SECL-07',
    risk: 'LOW',
    owner: 'Internal Maintenance',
    slaHours: 72,
    status: 'IN_PROGRESS',
    created: new Date(now.getTime() - 12 * 3600 * 1000).toISOString(),
    due: nextWeek,
    timeline: [
      { id: 't1', label: 'Observation raised', completed: true },
      { id: 't2', label: 'Owner assigned', completed: true },
      { id: 't3', label: 'Notification sent', completed: true },
      { id: 't4', label: 'Corrective action started', completed: true },
      { id: 't5', label: 'Evidence requested', completed: false },
      { id: 't6', label: 'Closure pending', completed: false },
    ],
    evidence: [],
    activities: [
      { timestamp: new Date(now.getTime() - 4 * 3600 * 1000).toISOString(), desc: 'Water pump repair initiated.' }
    ]
  },
  {
    id: 'KD-056',
    observation: 'Slope monitoring prism damaged',
    mine: 'NCL-12',
    risk: 'MEDIUM',
    owner: 'GeoSys Ltd',
    slaHours: 48,
    status: 'CLOSED',
    created: new Date(now.getTime() - 5 * 24 * 3600 * 1000).toISOString(),
    due: new Date(now.getTime() - 3 * 24 * 3600 * 1000),
    timeline: [
      { id: 't1', label: 'Observation raised', completed: true },
      { id: 't2', label: 'Owner assigned', completed: true },
      { id: 't3', label: 'Notification sent', completed: true },
      { id: 't4', label: 'Corrective action started', completed: true },
      { id: 't5', label: 'Evidence requested', completed: true },
      { id: 't6', label: 'Closure pending', completed: true },
    ],
    evidence: [{ name: 'prism_replaced.jpg', type: 'PHOTO' }],
    activities: [
      { timestamp: new Date(now.getTime() - 4 * 24 * 3600 * 1000).toISOString(), desc: 'Prism replaced and calibrated. Verified.' },
      { timestamp: new Date(now.getTime() - 3.5 * 24 * 3600 * 1000).toISOString(), desc: 'CAPA closed.' }
    ]
  }
]

const statusTabs = ['ALL', 'OPEN', 'IN_PROGRESS', 'ESCALATED', 'CLOSED']

function formatCountdown(due: Date, status: CapaStatus) {
  if (status === 'CLOSED') return '00:00:00'
  const diff = due.getTime() - new Date().getTime()
  if (diff <= 0) return 'OVERDUE'
  
  const h = Math.floor(diff / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function CAPAPage() {
  const [capas, setCapas] = useState<MockCapa[]>(initialCapas)
  const [activeTab, setActiveTab] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const [selectedCapaId, setSelectedCapaId] = useState<string | null>(null)
  const { toast } = useToast()

  // SLA Countdown timer
  useEffect(() => {
    const timer = setInterval(() => setCapas(c => [...c]), 1000) // Force re-render for countdown
    return () => clearInterval(timer)
  }, [])

  const { isActive: demoActive, currentStep } = useDemo()

  // Auto-select KD-102 for Demo Step 6
  useEffect(() => {
    if (demoActive && currentStep === 6 && !selectedCapaId) {
      setSelectedCapaId('KD-102')
    }
  }, [demoActive, currentStep, selectedCapaId])

  const openCount = capas.filter(c => c.status === 'OPEN').length
  const escalatedCount = capas.filter(c => c.status === 'ESCALATED').length
  const closedCount = capas.filter(c => c.status === 'CLOSED').length
  const dueTodayCount = capas.filter(c => {
    const diff = c.due.getTime() - new Date().getTime()
    return c.status !== 'CLOSED' && diff > 0 && diff <= 24 * 3600 * 1000
  }).length

  const filteredCapas = useMemo(() => {
    return capas.filter(c => {
      const matchSearch = c.id.toLowerCase().includes(search.toLowerCase()) || 
                          c.observation.toLowerCase().includes(search.toLowerCase()) ||
                          c.mine.toLowerCase().includes(search.toLowerCase())
      const matchStatus = activeTab === 'ALL' || c.status === activeTab
      return matchSearch && matchStatus
    })
  }, [capas, search, activeTab])

  const selectedCapa = capas.find(c => c.id === selectedCapaId)

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------
  const addActivity = (id: string, desc: string) => {
    setCapas(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, activities: [{ timestamp: new Date().toISOString(), desc }, ...c.activities] }
      }
      return c
    }))
  }

  const handleMarkInProgress = (id: string) => {
    setCapas(prev => prev.map(c => {
      if (c.id === id) {
        const newTimeline = [...c.timeline]
        newTimeline[3].completed = true // Corrective action started
        return { ...c, status: 'IN_PROGRESS', timeline: newTimeline }
      }
      return c
    }))
    addActivity(id, 'Marked IN PROGRESS. Corrective actions initiated.')
    toast({ title: 'CAPA marked in progress', type: 'success' })
  }

  const handleEscalate = (id: string) => {
    setCapas(prev => prev.map(c => c.id === id ? { ...c, status: 'ESCALATED' } : c))
    addActivity(id, 'ESCALATED to Mine Manager.')
    toast({ title: 'CAPA Escalated', type: 'warning' })
  }

  const handleRequestEvidence = (id: string) => {
    setCapas(prev => prev.map(c => {
      if (c.id === id) {
        const newTimeline = [...c.timeline]
        newTimeline[4].completed = true // Evidence requested
        return { ...c, timeline: newTimeline }
      }
      return c
    }))
    addActivity(id, 'Evidence request sent to owner.')
    toast({ title: 'Evidence requested', type: 'info' })
  }

  const handleClose = (id: string) => {
    setCapas(prev => prev.map(c => {
      if (c.id === id) {
        const newTimeline = c.timeline.map(t => ({ ...t, completed: true }))
        return { ...c, status: 'CLOSED', timeline: newTimeline }
      }
      return c
    }))
    addActivity(id, 'CAPA CLOSED. Workflow complete.')
    toast({ title: 'CAPA Closed successfully', type: 'success' })
  }

  return (
    <div className="relative h-[calc(100vh-140px)] flex flex-col space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-shrink-0">
        <KPICard label="OPEN" value={openCount} subtitle="Requires action" icon={<AlertTriangle className="w-4 h-4" />} />
        <KPICard label="ESCALATED" value={escalatedCount} subtitle="Management review" variant="danger" icon={<ShieldAlert className="w-4 h-4" />} />
        <KPICard label="DUE TODAY" value={dueTodayCount} subtitle="SLA expiring" variant="warning" icon={<Clock className="w-4 h-4" />} />
        <KPICard label="CLOSED" value={closedCount} subtitle="Verified resolution" variant="success" icon={<CheckCircle className="w-4 h-4" />} />
      </div>

      <div className="flex-1 flex flex-col bg-surface-raised border border-border rounded overflow-hidden">
        {/* Header & Tabs */}
        <div className="bg-mine-black/40 border-b border-border px-4 pt-4 shrink-0 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="font-heading text-lg text-text-primary tracking-wide flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-amber" />
              CAPA WORKSPACE
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search CAPAs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-mine-black border border-border rounded text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50"
              />
            </div>
          </div>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
            {statusTabs.map(tab => {
              const count = tab === 'ALL' ? capas.length : capas.filter(c => c.status === tab).length
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-3 text-[12px] font-medium tracking-wide transition-colors relative",
                    activeTab === tab ? "text-amber" : "text-text-muted hover:text-text-secondary"
                  )}
                >
                  {tab.replace('_', ' ')} ({count})
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Table */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[700px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-mine-black/95 backdrop-blur z-10">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">CAPA ID</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Observation</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Mine</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Risk</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Owner</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">SLA Left</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredCapas.map((c) => {
                const timeLeft = formatCountdown(c.due, c.status)
                const isOverdue = timeLeft === 'OVERDUE'
                return (
                  <tr 
                    key={c.id} 
                    onClick={() => setSelectedCapaId(c.id)}
                    className="hover:bg-mine-black cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3 text-[12px] font-mono text-amber font-medium">{c.id}</td>
                    <td className="px-4 py-3 text-[12px] text-text-primary font-medium">{c.observation}</td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary">{c.mine}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.risk as any} /></td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary">{c.owner}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[12px] font-mono font-bold", isOverdue ? "text-red" : c.status === 'CLOSED' ? "text-green" : "text-amber")}>
                        {timeLeft}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider",
                        c.status === 'OPEN' ? "bg-amber-dim text-amber border border-amber/20" :
                        c.status === 'CLOSED' ? "bg-green-dim text-green border border-green/20" :
                        c.status === 'ESCALATED' ? "bg-red-dim text-red border border-red/20" :
                        "bg-blue-900/30 text-blue-400 border border-blue-500/20"
                      )}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary font-mono">
                      {new Date(c.created).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
          {filteredCapas.length === 0 && (
            <div className="p-10 text-center text-text-muted">No CAPAs match the selected filters.</div>
          )}
        </div>
      </div>

      {/* Drawer Overlay */}
      {selectedCapa && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSelectedCapaId(null)}
        />
      )}

      {/* Right Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 w-full sm:w-[600px] bg-surface-raised border-l border-border shadow-2xl transform transition-transform duration-300 z-50 flex flex-col",
          selectedCapa ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedCapa && (
          <>
            <div className="flex items-center justify-between p-5 border-b border-border bg-mine-black/50 shrink-0">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-xl text-text-primary tracking-wide">CAPA DETAIL</h2>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[11px] font-bold tracking-wider",
                    selectedCapa.status === 'OPEN' ? "bg-amber-dim text-amber border border-amber/20" :
                    selectedCapa.status === 'CLOSED' ? "bg-green-dim text-green border border-green/20" :
                    selectedCapa.status === 'ESCALATED' ? "bg-red-dim text-red border border-red/20" :
                    "bg-blue-900/30 text-blue-400 border border-blue-500/20"
                  )}>
                    {selectedCapa.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[12px] font-mono text-text-muted mt-1">{selectedCapa.id} • {selectedCapa.mine}</p>
              </div>
              <button 
                onClick={() => setSelectedCapaId(null)}
                className="p-2 hover:bg-mine-black rounded transition-colors text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DemoHighlight step={6} tooltip="The Corrective & Preventive Action (CAPA) is tracked against a strict SLA timer to ensure accountability.">
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Meta Details */}
              <div className="bg-mine-black border border-border rounded-lg p-5">
                <h3 className="text-[16px] font-semibold text-text-primary mb-4">{selectedCapa.observation}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5"/> Risk</p>
                    <StatusBadge status={selectedCapa.risk as any} />
                  </div>
                  <div>
                    <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5"/> Owner</p>
                    <p className="text-[13px] text-text-primary font-medium">{selectedCapa.owner}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> SLA Term</p>
                    <p className="text-[13px] text-text-primary font-mono">{selectedCapa.slaHours} hours</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> Active SLA</p>
                    <p className={cn(
                      "text-[16px] font-mono font-bold",
                      formatCountdown(selectedCapa.due, selectedCapa.status) === 'OVERDUE' ? "text-red" : 
                      selectedCapa.status === 'CLOSED' ? "text-green" : "text-amber"
                    )}>
                      {formatCountdown(selectedCapa.due, selectedCapa.status)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Workflow Flowchart (Detection -> Action -> Follow-up -> Closure) */}
              <div>
                <h4 className="font-heading text-[13px] font-semibold text-text-secondary tracking-widest mb-3">WORKFLOW PROGRESS</h4>
                <div className="flex justify-between items-center bg-surface border border-border rounded p-4 relative">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-border -translate-y-1/2 z-0" />
                  
                  {['DETECTION', 'ACTION', 'FOLLOW-UP', 'CLOSURE'].map((step, idx) => {
                    let isActive = false
                    let isDone = false
                    
                    if (selectedCapa.status === 'CLOSED') {
                      isDone = true
                    } else if (selectedCapa.status === 'OPEN' && idx === 0) {
                      isActive = true
                    } else if (selectedCapa.status === 'IN_PROGRESS') {
                      if (idx < 2) isDone = true
                      if (idx === 2) isActive = true
                    } else if (selectedCapa.status === 'ESCALATED') {
                      if (idx < 2) isDone = true
                      if (idx === 1) isActive = true // Escalated is a blocker in action
                    }

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-surface px-2">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
                          isDone ? "bg-green border-green text-white" :
                          isActive ? "bg-mine-black border-amber text-amber" :
                          "bg-mine-black border-border text-border"
                        )}>
                          {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold tracking-wider",
                          isDone ? "text-green" : isActive ? "text-amber" : "text-text-muted"
                        )}>
                          {step}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actions Box */}
              {selectedCapa.status !== 'CLOSED' && (
                <div className="bg-amber-dim/20 border border-amber/20 rounded p-4">
                  <h4 className="font-heading text-[12px] font-semibold text-amber tracking-widest mb-3">AVAILABLE ACTIONS</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCapa.status === 'OPEN' && (
                      <button 
                        onClick={() => handleMarkInProgress(selectedCapa.id)}
                        className="px-3 py-1.5 bg-mine-black border border-border hover:border-amber text-text-primary text-[12px] rounded transition-colors"
                      >
                        Mark In Progress
                      </button>
                    )}
                    {(selectedCapa.status === 'OPEN' || selectedCapa.status === 'IN_PROGRESS') && (
                      <button 
                        onClick={() => handleEscalate(selectedCapa.id)}
                        className="px-3 py-1.5 bg-mine-black border border-border hover:border-red hover:text-red text-text-primary text-[12px] rounded transition-colors"
                      >
                        Escalate
                      </button>
                    )}
                    <button 
                      onClick={() => handleRequestEvidence(selectedCapa.id)}
                      className="px-3 py-1.5 bg-mine-black border border-border hover:border-blue-400 text-text-primary text-[12px] rounded transition-colors"
                    >
                      Request Evidence
                    </button>
                    <button 
                      onClick={() => handleClose(selectedCapa.id)}
                      className="px-3 py-1.5 bg-green-dim border border-green hover:bg-green text-white text-[12px] font-semibold rounded transition-colors ml-auto"
                    >
                      Close CAPA
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-heading text-[13px] font-semibold text-text-secondary tracking-widest mb-3">TIMELINE</h4>
                  <div className="space-y-3">
                    {selectedCapa.timeline.map((step) => (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                          step.completed ? "bg-green/20 border-green text-green" : "border-border text-transparent"
                        )}>
                          <CheckCircle className="w-3 h-3" />
                        </div>
                        <span className={cn("text-[12px]", step.completed ? "text-text-primary" : "text-text-muted")}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-heading text-[13px] font-semibold text-text-secondary tracking-widest mb-3">EVIDENCE</h4>
                  {selectedCapa.evidence.length === 0 ? (
                    <div className="text-[12px] text-text-muted italic border border-dashed border-border/50 rounded p-4 text-center">
                      No evidence uploaded yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedCapa.evidence.map((ev, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 border border-border rounded bg-mine-black">
                          <Paperclip className="w-4 h-4 text-text-muted" />
                          <span className="text-[12px] text-text-primary flex-1 truncate">{ev.name}</span>
                          <span className="text-[10px] bg-surface px-1.5 py-0.5 rounded text-text-muted">{ev.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Log */}
              <div>
                <h4 className="font-heading text-[13px] font-semibold text-text-secondary tracking-widest mb-3">ACTIVITY LOG</h4>
                <div className="bg-mine-black border border-border rounded p-4 space-y-4 max-h-[200px] overflow-y-auto">
                  {selectedCapa.activities.map((act, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-16 flex-shrink-0 text-[10px] text-text-muted font-mono pt-1 text-right">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="relative pb-6 flex-1">
                        {idx !== selectedCapa.activities.length - 1 && (
                          <div className="absolute top-4 left-[5px] bottom-0 w-px bg-border z-0" />
                        )}
                        <div className="absolute top-1.5 left-0 w-3 h-3 rounded-full bg-mine-black border border-amber z-10" />
                        <div className="pl-6 text-[12px] text-text-secondary">
                          {act.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              </div>
            </DemoHighlight>
          </>
        )}
      </div>

    </div>
  )
}
