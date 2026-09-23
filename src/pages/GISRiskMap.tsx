import { useEffect, useRef, useState, useMemo } from 'react'
import * as maplibregl from 'maplibre-gl'
import { Search, RotateCcw, ShieldAlert, Activity, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { mines } from '../data/mines'
import { cn } from '../lib/utils'
import DemoHighlight from '../components/shared/DemoHighlight'
import { useIsMobile } from '../lib/useIsMobile'

const riskSeverity = { HIGH: 3, MEDIUM: 2, LOW: 1 }

export default function GISRiskMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('ALL')
  const [subsidiaryFilter, setSubsidiaryFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [showFilters, setShowFilters] = useState(false)
  const [showMineList, setShowMineList] = useState(!isMobile)
  
  const subsidiaries = useMemo(() => Array.from(new Set(mines.map(m => m.subsidiaryCode))), [])
  const types = useMemo(() => Array.from(new Set(mines.map(m => m.type))), [])

  const filteredMines = useMemo(() => {
    return mines.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.code.toLowerCase().includes(search.toLowerCase())
      const matchRisk = riskFilter === 'ALL' || m.riskLevel === riskFilter
      const matchSub = subsidiaryFilter === 'ALL' || m.subsidiaryCode === subsidiaryFilter
      const matchType = typeFilter === 'ALL' || m.type === typeFilter
      return matchSearch && matchRisk && matchSub && matchType
    })
  }, [search, riskFilter, subsidiaryFilter, typeFilter])

  const sortedMines = useMemo(() => {
    return [...filteredMines].sort((a, b) => riskSeverity[b.riskLevel] - riskSeverity[a.riskLevel])
  }, [filteredMines])

  const resetView = () => {
    map.current?.flyTo({ center: [82.5, 22.5], zoom: 5 })
    setSearch('')
    setRiskFilter('ALL')
    setSubsidiaryFilter('ALL')
    setTypeFilter('ALL')
  }

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [82.5, 22.5],
      zoom: 5
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Update Markers
  useEffect(() => {
    if (!map.current) return

    const existingMarkers = document.querySelectorAll('.mine-marker')
    existingMarkers.forEach(el => el.remove())

    filteredMines.forEach(mine => {
      const color = mine.riskLevel === 'HIGH' ? '#C1292E' : mine.riskLevel === 'MEDIUM' ? '#F0A202' : '#2E7D4F'
      const openCapaCount = mine.riskLevel === 'HIGH' ? 7 : mine.riskLevel === 'MEDIUM' ? 3 : 0
      
      const el = document.createElement('div')
      el.className = 'mine-marker'
      el.style.width = '16px'
      el.style.height = '16px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = color
      el.style.border = '2px solid rgba(255,255,255,0.3)'
      el.style.cursor = 'pointer'
      el.style.boxShadow = `0 0 12px ${color}80`

      const popupNode = document.createElement('div')
      popupNode.innerHTML = `
        <div style="min-width: 200px; font-family: 'Inter', sans-serif;">
          <div style="font-weight: 700; font-size: 14px; color: #EDE6DA; font-family: 'IBM Plex Mono', monospace; margin-bottom: 12px;">
            Mine:<br/><span style="color: ${color}">${mine.code}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;">
              <span style="color: #8E99A4;">Risk:</span>
              <span style="color: ${color}; font-weight: 700;">${mine.riskLevel}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;">
              <span style="color: #8E99A4;">Compliance:</span>
              <span style="color: #EDE6DA; font-weight: 600; font-family: 'IBM Plex Mono', monospace;">${mine.complianceScore}%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #8E99A4;">Open CAPA:</span>
              <span style="color: #EDE6DA; font-weight: 600; font-family: 'IBM Plex Mono', monospace;">${openCapaCount}</span>
            </div>
          </div>
          <button id="view-btn-${mine.id}" style="width: 100%; margin-top: 16px; padding: 8px 0; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.2s;">
            View Mine
          </button>
        </div>
      `
      
      const popup = new maplibregl.Popup({ offset: 12, closeButton: true, maxWidth: '240px' })
        .setDOMContent(popupNode)

      popup.on('open', () => {
        document.getElementById(`view-btn-${mine.id}`)?.addEventListener('click', () => {
          navigate(`/mines/${mine.id}`)
        })
      })

      new maplibregl.Marker({ element: el })
        .setLngLat(mine.coordinates)
        .setPopup(popup)
        .addTo(map.current!)
    })
  }, [filteredMines, navigate])

  return (
    <div className={cn(
      "overflow-hidden bg-mine-black",
      isMobile ? "flex flex-col h-[calc(100vh-140px)]" : "flex h-[calc(100vh-64px)]"
    )}>
      {/* Main Map Area */}
      <div className={cn(
        "flex flex-col relative",
        isMobile ? "flex-shrink-0" : "flex-1 border-r border-border"
      )}
      style={isMobile ? { height: '50vh', minHeight: '280px' } : undefined}
      >
        {/* Controls Overlay Bar */}
        {isMobile ? (
          /* Mobile: compact filter bar */
          <div className="absolute top-2 left-2 right-2 z-10 flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search mines..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface-raised/95 backdrop-blur border border-border rounded text-[13px] text-text-primary focus:outline-none focus:border-amber/50"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2 border rounded transition-colors flex-shrink-0",
                showFilters ? "bg-amber/10 border-amber/30 text-amber" : "bg-surface-raised/95 backdrop-blur border-border text-text-secondary"
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
            <button 
              onClick={resetView}
              className="p-2 bg-surface-raised/95 backdrop-blur border border-border rounded text-text-secondary flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Desktop: full filter bar */
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-3 p-3 bg-surface-raised/95 backdrop-blur border border-border rounded-lg shadow-2xl items-center">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search mines..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary focus:outline-none focus:border-amber/50"
              />
            </div>
            
            <select 
              value={riskFilter} 
              onChange={e => setRiskFilter(e.target.value)}
              className="px-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary focus:outline-none"
            >
              <option value="ALL">All Risks</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>

            <select 
              value={subsidiaryFilter} 
              onChange={e => setSubsidiaryFilter(e.target.value)}
              className="px-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary focus:outline-none"
            >
              <option value="ALL">All Subsidiaries</option>
              {subsidiaries.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              value={typeFilter} 
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary focus:outline-none"
            >
              <option value="ALL">All Types</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            
            <div className="flex-1" />

            <button 
              onClick={resetView}
              className="px-4 py-2 bg-surface hover:bg-slate transition-colors border border-border rounded text-[13px] text-text-secondary flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              Reset View
            </button>
          </div>
        )}

        {/* Mobile filter dropdown */}
        {isMobile && showFilters && (
          <div className="absolute top-14 left-2 right-2 z-10 bg-surface-raised/95 backdrop-blur border border-border rounded-lg p-3 shadow-2xl space-y-2">
            <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary focus:outline-none">
              <option value="ALL">All Risks</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
            <select value={subsidiaryFilter} onChange={e => setSubsidiaryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary focus:outline-none">
              <option value="ALL">All Subsidiaries</option>
              {subsidiaries.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary focus:outline-none">
              <option value="ALL">All Types</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}

        {/* Map Container */}
        <div ref={mapContainer} className="flex-1" />

        {/* Legend */}
        <div className={cn(
          "absolute z-10 bg-surface-raised/95 backdrop-blur border border-border rounded-lg shadow-xl",
          isMobile ? "bottom-2 left-2 p-2" : "bottom-6 left-6 p-4"
        )}>
          <h4 className={cn("font-heading font-semibold text-text-muted mb-2", isMobile ? "text-[10px] mb-1.5" : "text-[12px] mb-3")}>RISK SEVERITY</h4>
          <div className={cn("flex gap-3", isMobile ? "flex-row" : "flex-col gap-2")}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#C1292E] shadow-[0_0_8px_rgba(193,41,46,0.5)] border border-white/20" />
              <span className={cn("text-text-secondary", isMobile ? "text-[10px]" : "text-[12px]")}>High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F0A202] shadow-[0_0_8px_rgba(240,162,2,0.5)] border border-white/20" />
              <span className={cn("text-text-secondary", isMobile ? "text-[10px]" : "text-[12px]")}>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2E7D4F] shadow-[0_0_8px_rgba(46,125,79,0.5)] border border-white/20" />
              <span className={cn("text-text-secondary", isMobile ? "text-[10px]" : "text-[12px]")}>Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel (Desktop) / Bottom Section (Mobile) */}
      {isMobile ? (
        <div className="flex-1 bg-surface-raised flex flex-col overflow-hidden border-t border-border">
          <button
            onClick={() => setShowMineList(!showMineList)}
            className="p-3 border-b border-border bg-mine-black/40 flex items-center justify-between flex-shrink-0"
          >
            <div>
              <h2 className="font-heading text-sm text-text-primary tracking-wide">RISK-RANKED MINES</h2>
              <p className="text-[11px] text-text-muted mt-0.5">{sortedMines.length} mines</p>
            </div>
            {showMineList ? <ChevronDown className="w-4 h-4 text-text-muted" /> : <ChevronUp className="w-4 h-4 text-text-muted" />}
          </button>
          
          {showMineList && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sortedMines.map(mine => renderMineCard(mine, map))}
              {sortedMines.length === 0 && (
                <div className="p-6 text-center text-text-muted text-[13px]">No mines match your filters.</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-[380px] flex-shrink-0 bg-surface-raised flex flex-col">
          <div className="p-5 border-b border-border bg-mine-black/40">
            <h2 className="font-heading text-lg text-text-primary tracking-wide">RISK-RANKED MINES</h2>
            <p className="text-[13px] text-text-muted mt-1">Monitored sites sorted by priority.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sortedMines.map(mine => renderMineCard(mine, map))}
            {sortedMines.length === 0 && (
              <div className="p-8 text-center text-text-muted text-[13px]">No mines match your filters.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function renderMineCard(mine: typeof mines[0], map: React.RefObject<maplibregl.Map | null>) {
  const riskColors = {
    HIGH: 'text-red bg-red-dim border-red/20',
    MEDIUM: 'text-amber bg-amber-dim border-amber/20',
    LOW: 'text-green bg-green-dim border-green/20'
  }
  const badgeClass = riskColors[mine.riskLevel]
  const openCapaCount = mine.riskLevel === 'HIGH' ? 7 : mine.riskLevel === 'MEDIUM' ? 3 : 0

  const card = (
    <div 
      onClick={() => {
        map.current?.flyTo({ center: mine.coordinates, zoom: 9 })
      }}
      className="p-3 sm:p-4 border border-border bg-mine-black rounded-lg cursor-pointer hover:border-border-light transition-all group"
    >
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div>
          <h3 className="font-mono text-[13px] sm:text-[14px] text-amber font-semibold">{mine.code}</h3>
          <p className="text-[11px] sm:text-[12px] text-text-muted mt-0.5">{mine.name}</p>
        </div>
        <span className={cn("px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold rounded-sm border", badgeClass)}>
          {mine.riskLevel}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-border/50">
        <div>
          <p className="text-[10px] sm:text-[11px] text-text-muted mb-0.5 sm:mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5"/> Compliance</p>
          <p className="font-mono text-[12px] sm:text-[13px] text-text-primary">{mine.complianceScore}%</p>
        </div>
        <div>
          <p className="text-[10px] sm:text-[11px] text-text-muted mb-0.5 sm:mb-1 flex items-center gap-1"><Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5"/> Open CAPA</p>
          <p className="font-mono text-[12px] sm:text-[13px] text-text-primary">{openCapaCount}</p>
        </div>
      </div>
    </div>
  )

  if (mine.code === 'WCL-04') {
    return (
      <DemoHighlight key={mine.id} step={2} tooltip="The risk engine prioritizes WCL-04 for attention.">
        {card}
      </DemoHighlight>
    )
  }

  return <div key={mine.id}>{card}</div>
}
