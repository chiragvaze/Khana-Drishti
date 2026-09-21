import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import { mines } from '../data/mines'
import { cn } from '../lib/utils'

export default function GISRiskMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [selectedMine, setSelectedMine] = useState<string | null>(null)
  const [riskFilter, setRiskFilter] = useState<string>('ALL')

  const filteredMines = riskFilter === 'ALL' ? mines : mines.filter((m) => m.riskLevel === riskFilter)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [82.5, 22.5],
      zoom: 5,
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current) return

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.mine-marker')
    existingMarkers.forEach((el) => el.remove())

    filteredMines.forEach((mine) => {
      const color =
        mine.riskLevel === 'HIGH' ? '#C1292E' : mine.riskLevel === 'MEDIUM' ? '#F0A202' : '#2E7D4F'

      const el = document.createElement('div')
      el.className = 'mine-marker'
      el.style.width = '14px'
      el.style.height = '14px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = color
      el.style.border = '2px solid rgba(255,255,255,0.3)'
      el.style.cursor = 'pointer'
      el.style.boxShadow = `0 0 8px ${color}80`

      const popup = new maplibregl.Popup({ offset: 10, closeButton: false })
        .setHTML(`
          <div style="min-width: 200px">
            <div style="font-weight: 700; font-size: 13px; color: #F0A202; font-family: 'IBM Plex Mono', monospace;">${mine.code}</div>
            <div style="font-weight: 600; font-size: 12px; margin-top: 2px;">${mine.name}</div>
            <div style="font-size: 11px; color: #8E99A4; margin-top: 4px;">${mine.subsidiary}</div>
            <div style="font-size: 11px; color: #8E99A4;">${mine.location}, ${mine.state}</div>
            <div style="margin-top: 8px; display: flex; gap: 12px; font-size: 11px;">
              <div>
                <span style="color: #8E99A4;">Risk: </span>
                <span style="color: ${color}; font-weight: 600;">${mine.riskLevel}</span>
              </div>
              <div>
                <span style="color: #8E99A4;">Compliance: </span>
                <span style="color: ${mine.complianceScore >= 80 ? '#2E7D4F' : mine.complianceScore >= 60 ? '#F0A202' : '#C1292E'}; font-weight: 600; font-family: 'IBM Plex Mono', monospace;">${mine.complianceScore}%</span>
              </div>
            </div>
            <div style="margin-top: 4px; font-size: 11px;">
              <span style="color: #8E99A4;">Type: </span>
              <span>${mine.type.replace('_', ' ')}</span>
            </div>
          </div>
        `)

      el.addEventListener('mouseenter', () => setSelectedMine(mine.id))
      el.addEventListener('mouseleave', () => setSelectedMine(null))

      new maplibregl.Marker({ element: el })
        .setLngLat(mine.coordinates)
        .setPopup(popup)
        .addTo(map.current!)
    })
  }, [filteredMines])

  return (
    <div className="flex gap-4 h-[calc(100vh-140px)]">
      {/* Side Panel */}
      <div className="w-[280px] flex-shrink-0 bg-surface-raised border border-border rounded overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider">MINE LOCATIONS</h3>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full mt-2 px-2 py-1.5 bg-mine-black border border-border rounded text-[12px] text-text-secondary focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk Only</option>
            <option value="MEDIUM">Medium Risk Only</option>
            <option value="LOW">Low Risk Only</option>
          </select>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filteredMines.map((mine) => (
            <div
              key={mine.id}
              className={cn(
                'px-4 py-3 cursor-pointer transition-colors',
                selectedMine === mine.id ? 'bg-amber-dim' : 'hover:bg-mine-black/50'
              )}
              onClick={() => {
                setSelectedMine(mine.id)
                map.current?.flyTo({ center: mine.coordinates, zoom: 8 })
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      mine.riskLevel === 'HIGH' ? '#C1292E' : mine.riskLevel === 'MEDIUM' ? '#F0A202' : '#2E7D4F',
                  }}
                />
                <span className="font-mono text-[12px] text-amber font-medium">{mine.code}</span>
              </div>
              <p className="text-[12px] text-text-primary mt-0.5 ml-[18px]">{mine.name}</p>
              <p className="text-[11px] text-text-muted ml-[18px]">{mine.location}</p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="px-4 py-3 border-t border-border">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Risk Legend</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red" />
              <span className="text-[11px] text-text-secondary">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber" />
              <span className="text-[11px] text-text-secondary">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green" />
              <span className="text-[11px] text-text-secondary">Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 rounded overflow-hidden border border-border">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  )
}
