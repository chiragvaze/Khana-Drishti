import { useState, useMemo, useEffect } from 'react'
import { Camera, Search, Image, Film, FileText, Radio, Mic, Brain, X } from 'lucide-react'
import { StatusBadge } from '../components/shared/StatusBadge'
import { KPICard } from '../components/shared/KPICard'
import DemoHighlight from '../components/shared/DemoHighlight'
import { useDemo } from '../contexts/DemoContext'
import { evidence } from '../data/evidence'
import { formatDateTime, cn } from '../lib/utils'
import type { EvidenceType } from '../data/types'
import { useIsMobile } from '../lib/useIsMobile'

const typeIcons: Record<EvidenceType, React.ReactNode> = {
  PHOTO: <Image className="w-5 h-5" />,
  VIDEO: <Film className="w-5 h-5" />,
  DOCUMENT: <FileText className="w-5 h-5" />,
  SENSOR_DATA: <Radio className="w-5 h-5" />,
  AUDIO: <Mic className="w-5 h-5" />,
}

const typeColors: Record<EvidenceType, string> = {
  PHOTO: 'bg-blue-950 text-blue-400',
  VIDEO: 'bg-purple-950 text-purple-400',
  DOCUMENT: 'bg-amber-dim text-amber',
  SENSOR_DATA: 'bg-green-dim text-green-light',
  AUDIO: 'bg-red-dim text-red-light',
}

export default function EvidencePage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [aiStatusFilter, setAiStatusFilter] = useState<string>('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null)
  const [imageError, setImageError] = useState<boolean>(false)

  const { isActive: demoActive, currentStep } = useDemo()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (demoActive && currentStep === 3 && !selectedEvidence) {
      const kdE102 = evidence.find(e => e.id === 'KD-E102')
      if (kdE102) setSelectedEvidence(kdE102.id)
    }
  }, [demoActive, currentStep, selectedEvidence])

  // Reset image error state when selected evidence changes
  useMemo(() => {
    setImageError(false)
  }, [selectedEvidence])

  const filtered = useMemo(() => {
    return evidence.filter((e) => {
      const matchSearch =
        e.fileName.toLowerCase().includes(search.toLowerCase()) ||
        e.mineName.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some((t) => t.includes(search.toLowerCase()))
      const matchType = typeFilter === 'ALL' || e.type === typeFilter
      const matchAI = aiStatusFilter === 'ALL' || e.aiAnalysisStatus === aiStatusFilter
      return matchSearch && matchType && matchAI
    })
  }, [search, typeFilter, aiStatusFilter])

  const selected = evidence.find((e) => e.id === selectedEvidence)
  const photoCount = evidence.filter((e) => e.type === 'PHOTO').length
  const flaggedCount = evidence.filter((e) => e.aiAnalysisStatus === 'FLAGGED').length

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Evidence" value={evidence.length} icon={<Camera className="w-4 h-4" />} />
        <KPICard label="Photos" value={photoCount} />
        <KPICard label="AI Flagged" value={flaggedCount} variant="danger" icon={<Brain className="w-4 h-4" />} />
        <KPICard label="AI Analyzed" value={evidence.filter((e) => e.aiAnalysisStatus !== 'PENDING').length} variant="success" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search evidence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface-raised border border-border rounded text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none">
          <option value="ALL">All Types</option>
          <option value="PHOTO">Photos</option>
          <option value="VIDEO">Videos</option>
          <option value="DOCUMENT">Documents</option>
          <option value="SENSOR_DATA">Sensor Data</option>
        </select>
        <select value={aiStatusFilter} onChange={(e) => setAiStatusFilter(e.target.value)} className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none">
          <option value="ALL">All AI Status</option>
          <option value="FLAGGED">Flagged</option>
          <option value="ANALYZED">Analyzed</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
        </select>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setViewMode('grid')} className={cn('px-2 py-1 rounded text-[11px]', viewMode === 'grid' ? 'bg-amber-dim text-amber' : 'text-text-muted')}>
            Grid
          </button>
          <button onClick={() => setViewMode('list')} className={cn('px-2 py-1 rounded text-[11px]', viewMode === 'list' ? 'bg-amber-dim text-amber' : 'text-text-muted')}>
            List
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={cn("gap-4", isMobile ? "flex flex-col" : "flex")}>
        <div className="flex-1 min-w-0">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvidence(ev.id)}
                  className={cn(
                    'bg-surface-raised border rounded overflow-hidden cursor-pointer transition-all',
                    selectedEvidence === ev.id ? 'border-amber/50' : 'border-border hover:border-border-light'
                  )}
                >
                  <div className="h-28 bg-mine-black flex items-center justify-center">
                    <div className={cn('p-3 rounded', typeColors[ev.type])}>
                      {typeIcons[ev.type]}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] font-mono text-amber mb-1">{ev.id}</p>
                    <p className="text-[11px] font-medium text-text-primary truncate">{ev.fileName}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{ev.mineName} • {ev.location || ev.geoTag.split(' ')[0]}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <StatusBadge status={ev.aiAnalysisStatus} />
                      {ev.confidence && <span className="text-[10px] bg-mine-black px-1.5 py-0.5 rounded text-amber">{ev.confidence}%</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-raised border border-border rounded overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-mine-black/50">
                    <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Mine</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">AI Class.</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Conf.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((ev) => (
                    <tr key={ev.id} onClick={() => setSelectedEvidence(ev.id)} className="hover:bg-mine-black/50 cursor-pointer transition-colors">
                      <td className="px-4 py-3 text-[12px] font-mono text-text-secondary">{ev.id}</td>
                      <td className="px-4 py-3"><span className={cn('p-1.5 rounded inline-flex', typeColors[ev.type])}>{typeIcons[ev.type]}</span></td>
                      <td className="px-4 py-3 text-[12px] text-text-primary">{ev.mineName}</td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary truncate max-w-[120px]">{ev.location || ev.geoTag}</td>
                      <td className="px-4 py-3 text-[12px] font-mono text-text-secondary">{formatDateTime(ev.capturedDate)}</td>
                      <td className="px-4 py-3"><StatusBadge status={ev.aiAnalysisStatus} /></td>
                      <td className="px-4 py-3 text-[12px] font-mono text-amber">{ev.confidence ? `${ev.confidence}%` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (() => {
          const detailPane = (
          <div className={cn(
            isMobile
              ? "fixed inset-0 z-50 bg-surface-raised overflow-y-auto p-4"
              : "w-[360px] flex-shrink-0 bg-surface-raised border border-border rounded p-5 self-start sticky top-0"
          )}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-[15px] font-bold text-text-primary tracking-wide">EVIDENCE</h3>
              <button onClick={() => setSelectedEvidence(null)} className="text-text-muted hover:text-text-secondary p-1" aria-label="Close evidence detail">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
              {selected.type === 'PHOTO' ? (
                <div className="h-48 bg-mine-black rounded overflow-hidden relative">
                  {!imageError ? (
                    <img 
                      src={`/evidence/${selected.fileName}`} 
                      alt="Evidence" 
                      className="w-full h-full object-cover opacity-80"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-mine-black-light border border-border/50">
                      <Image className="w-8 h-8 text-text-muted mb-2 opacity-50" />
                      <span className="text-[12px] text-text-secondary font-medium">Evidence preview unavailable</span>
                      <span className="text-[10px] text-text-muted mt-1 font-mono">{selected.fileName}</span>
                    </div>
                  )}
                  
                  {!imageError && (
                    <>
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded"></div>
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur text-white text-[9px] px-2 py-1 rounded font-mono">SIMULATED ASSET</div>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-32 bg-mine-black rounded flex items-center justify-center">
                  <div className={cn('p-4 rounded', typeColors[selected.type])}>
                    {typeIcons[selected.type]}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Evidence ID</p>
                  <p className="text-[12px] font-mono text-text-primary mt-0.5">{selected.id}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Type</p>
                  <p className="text-[12px] text-text-primary mt-0.5">{selected.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Inspection</p>
                  <p className="text-[12px] font-mono text-text-primary mt-0.5">{selected.inspectionId}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Mine</p>
                  <p className="text-[12px] text-text-primary mt-0.5">{selected.mineName}</p>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">File</p>
                <p className="text-[12px] font-mono text-text-primary mt-0.5">{selected.fileName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Timestamp</p>
                  <p className="text-[11px] font-mono text-text-secondary mt-0.5">{formatDateTime(selected.capturedDate)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Location / GeoTag</p>
                  <p className="text-[11px] font-mono text-text-secondary mt-0.5">{selected.location || selected.geoTag}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-amber" />
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">AI Classification</span>
                  <StatusBadge status={selected.aiAnalysisStatus} />
                  {selected.confidence && <span className="text-[11px] font-mono text-amber ml-auto">{selected.confidence}% Conf.</span>}
                </div>
                {selected.aiFindings && (
                  <p className="text-[12px] text-text-secondary leading-relaxed">{selected.aiFindings}</p>
                )}
              </div>

              {(selected.matchedObligation || selected.associatedObservation || selected.associatedCAPA) && (
                <div className="pt-3 border-t border-border space-y-3">
                  {selected.matchedObligation && (
                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Matched Obligation</span>
                      <span className="text-[12px] text-text-primary bg-mine-black px-2 py-1 rounded inline-block">{selected.matchedObligation}</span>
                    </div>
                  )}
                  {selected.associatedObservation && (
                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Associated Observation</span>
                      <span className="text-[12px] text-text-primary bg-mine-black px-2 py-1 rounded inline-block">{selected.associatedObservation}</span>
                    </div>
                  )}
                  {selected.associatedCAPA && (
                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Associated CAPA</span>
                      <span className="text-[12px] font-mono text-amber bg-amber-dim/20 border border-amber/20 px-2 py-1 rounded inline-block">{selected.associatedCAPA}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-1 pt-2">
                {selected.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-mine-black text-text-muted text-[10px] rounded">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )
        if (selected.id === 'KD-E102') {
          return (
            <DemoHighlight step={3} tooltip="Field evidence is linked directly to the mine and inspection record.">
              {detailPane}
            </DemoHighlight>
          )
        }
        return detailPane
        })()}
      </div>
    </div>
  )
}
