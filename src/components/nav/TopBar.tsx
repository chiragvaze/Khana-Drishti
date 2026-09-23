import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, User, ChevronRight, Search, AlertTriangle, ShieldCheck, ClipboardCheck, Camera, Database, Check, Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useRole } from '../../contexts/RoleContext'
import type { Role } from '../../contexts/RoleContext'
import { useDemo } from '../../contexts/DemoContext'
import KhananLogo from '../shared/KhananLogo'

interface TopBarProps {
  isMobile: boolean
  onMenuToggle: () => void
}

const routeTitles: Record<string, string> = {
  '/': 'Command Center',
  '/mines': 'Mines',
  '/map': 'GIS Risk Map',
  '/compliance': 'Compliance & Risk',
  '/capa': 'CAPA Management',
  '/contractors': 'Contractors',
  '/inspections': 'Inspections',
  '/evidence': 'Evidence',
  '/ai-insights': 'AI Insights',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
}

const subsidiaries = [
  'All Subsidiaries',
  'WCL — Western Coalfields',
  'SECL — South Eastern Coalfields',
  'NCL — Northern Coalfields',
  'ECL — Eastern Coalfields',
  'MCL — Mahanadi Coalfields',
  'CCL — Central Coalfields',
  'BCCL — Bharat Coking Coal',
]

const getMockSearchResults = (query: string) => {
  if (!query) return []
  const q = query.toLowerCase()
  if (q.includes('wcl-04') || q.includes('wcl')) {
    return [
      { type: 'Mine', title: 'WCL-04 — Wani Opencast Extension', icon: <Database className="w-3 h-3 text-blue-400" />, link: '/mines/mine-wcl-04' },
      { type: 'Risk', title: 'CRITICAL: Ventilation failure imminent', icon: <AlertTriangle className="w-3 h-3 text-red" />, link: '/ai-insights' },
      { type: 'CAPA', title: 'Ventilation restoration CAPA (Overdue)', icon: <ShieldCheck className="w-3 h-3 text-amber" />, link: '/capa' },
      { type: 'Inspections', title: 'Routine inspection — 4 observations', icon: <ClipboardCheck className="w-3 h-3 text-text-secondary" />, link: '/inspections' },
      { type: 'Evidence', title: 'KD-E102 (Photo)', icon: <Camera className="w-3 h-3 text-text-secondary" />, link: '/evidence' },
    ]
  }
  return [
    { type: 'General', title: `Search results for "${query}"`, icon: <Search className="w-3 h-3 text-text-muted" />, link: '#' }
  ]
}

const roleProfiles: Record<Role, { name: string, title: string }> = {
  MINE_OFFICIAL: { name: 'A.K. Sharma', title: 'Mine Manager, WCL-04' },
  CORPORATE_MANAGEMENT: { name: 'Shri V.K. Patel', title: 'Director (Technical), CIL' },
  REGULATORY_AUTHORITY: { name: 'Dr. R. Singh', title: 'Director General, DGMS' },
}

export default function TopBar({ isMobile, onMenuToggle }: TopBarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { role, setRole } = useRole()
  const { isActive: demoActive, startDemo } = useDemo()
  
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('All Subsidiaries')
  const [showSubsidiaryDropdown, setShowSubsidiaryDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)

  const pathParts = location.pathname.split('/').filter(Boolean)
  const currentTitle =
    routeTitles[location.pathname] ||
    (pathParts.length > 1 ? 'Mine Detail' : 'Dashboard')

  const breadcrumbs = [
    'Khanan Drishti',
    ...(currentTitle !== 'Command Center' ? [currentTitle] : []),
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (isMobile) {
          setShowMobileSearch(true)
          setTimeout(() => mobileSearchInputRef.current?.focus(), 100)
        } else {
          searchInputRef.current?.focus()
        }
      }
      if (e.key === 'Escape') {
        setShowSearch(false)
        setShowMobileSearch(false)
        setShowNotifications(false)
        setShowSubsidiaryDropdown(false)
        setShowRoleDropdown(false)
        searchInputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobile])

  const searchResults = getMockSearchResults(searchQuery)
  const profile = roleProfiles[role]

  // Close mobile search on route change
  useEffect(() => {
    setShowMobileSearch(false)
    setSearchQuery('')
  }, [location.pathname])

  // ──────────────────────────────────────────────
  // Mobile Search Overlay
  // ──────────────────────────────────────────────
  const mobileSearchOverlay = showMobileSearch && (
    <div className="fixed inset-0 z-[60] bg-mine-black flex flex-col animate-fade-in">
      <div className="h-[56px] flex items-center gap-3 px-4 border-b border-border flex-shrink-0">
        <button
          onClick={() => { setShowMobileSearch(false); setSearchQuery('') }}
          className="p-1 text-text-muted"
          aria-label="Close search"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            ref={mobileSearchInputRef}
            type="text"
            placeholder="Search mines, CAPA, evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full pl-10 pr-3 py-2 bg-surface-raised border border-border rounded text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {searchQuery && searchResults.map((result, idx) => (
          <button
            key={idx}
            onClick={() => {
              navigate(result.link)
              setShowMobileSearch(false)
              setSearchQuery('')
            }}
            className="w-full text-left px-4 py-3 border-b border-border/50 hover:bg-surface-raised transition-colors flex items-center gap-3"
          >
            <div className="p-2 bg-surface-raised border border-border rounded">
              {result.icon}
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-primary">{result.title}</p>
              <p className="text-[11px] text-text-muted uppercase tracking-wider">{result.type}</p>
            </div>
          </button>
        ))}
        {searchQuery && searchResults.length === 0 && (
          <div className="px-4 py-12 text-center text-[13px] text-text-muted">
            No results found for "{searchQuery}"
          </div>
        )}
        {!searchQuery && (
          <div className="px-4 py-12 text-center text-[13px] text-text-muted">
            Search for mines, CAPAs, evidence, inspections...
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <header className="h-[56px] bg-mine-black border-b border-border flex items-center justify-between px-3 sm:px-5 flex-shrink-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={onMenuToggle}
              className="p-2 -ml-1 text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Mobile: compact logo + title */}
          {isMobile ? (
            <div className="flex items-center gap-2 min-w-0">
              <KhananLogo variant="icon" size="sm" className="h-[24px] w-[24px]" />
              <span className="font-heading text-[14px] font-bold text-text-primary tracking-wider truncate">
                {currentTitle}
              </span>
            </div>
          ) : (
            /* Desktop: title + breadcrumbs */
            <div className="flex flex-col justify-center">
              <h1 className="text-[18px] font-heading font-bold text-text-primary tracking-wide leading-tight flex items-center gap-2">
                {currentTitle}
                <span className="hidden sm:inline-block text-[11px] font-normal text-amber px-2 py-0.5 border border-amber/30 rounded-full bg-amber-dim">
                  {role.replace('_', ' ')}
                </span>
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
                <span className="flex items-center gap-1">
                  {breadcrumbs.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-1">
                      {i > 0 && <ChevronRight className="w-3 h-3" />}
                      <span className={i === breadcrumbs.length - 1 ? 'text-text-secondary' : ''}>
                        {crumb}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="text-border">•</span>
                <span className="font-mono">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          
          {/* Mobile search icon */}
          {isMobile && (
            <button
              onClick={() => setShowMobileSearch(true)}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
          )}

          {/* Global Search — Desktop only */}
          {!isMobile && (
            <div className="relative hidden md:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search mines, CAPA, evidence..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearch(true)
                    setShowNotifications(false)
                    setShowSubsidiaryDropdown(false)
                    setShowRoleDropdown(false)
                  }}
                  onFocus={() => setShowSearch(true)}
                  className="w-[280px] pl-8 pr-10 py-1.5 bg-surface-raised border border-border rounded text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50 transition-colors"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                  <kbd className="text-[9px] font-mono bg-mine-black px-1 rounded text-text-muted border border-border">Ctrl</kbd>
                  <kbd className="text-[9px] font-mono bg-mine-black px-1 rounded text-text-muted border border-border">K</kbd>
                </div>
              </div>
              
              {showSearch && searchQuery && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSearch(false)} />
                  <div className="absolute right-0 top-full mt-1 w-[360px] bg-surface-raised border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                    <div className="px-3 py-2 border-b border-border bg-mine-black/50">
                      <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Search Results</span>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            navigate(result.link)
                            setShowSearch(false)
                            setSearchQuery('')
                          }}
                          className="w-full text-left px-3 py-2.5 border-b border-border/50 hover:bg-mine-black transition-colors flex items-center gap-3 group"
                        >
                          <div className="p-1.5 bg-mine-black border border-border rounded group-hover:border-amber/30 transition-colors">
                            {result.icon}
                          </div>
                          <div>
                            <p className="text-[12px] font-medium text-text-primary">{result.title}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-wider">{result.type}</p>
                          </div>
                        </button>
                      ))}
                      {searchResults.length === 0 && (
                        <div className="px-4 py-8 text-center text-[12px] text-text-muted">
                          No results found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Subsidiary Selector — hidden on mobile */}
          {role !== 'MINE_OFFICIAL' && !isMobile && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowSubsidiaryDropdown(!showSubsidiaryDropdown)
                  setShowNotifications(false)
                  setShowSearch(false)
                  setShowRoleDropdown(false)
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-raised border border-border rounded text-[12px] text-text-secondary hover:text-text-primary transition-colors"
              >
                <span className="max-w-[140px] truncate">{selectedSubsidiary}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showSubsidiaryDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSubsidiaryDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-[240px] bg-surface-raised border border-border rounded-lg shadow-2xl z-50 py-1">
                    {subsidiaries.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setSelectedSubsidiary(sub)
                          setShowSubsidiaryDropdown(false)
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-[12px] transition-colors',
                          selectedSubsidiary === sub
                            ? 'text-amber bg-amber-dim'
                            : 'text-text-secondary hover:text-text-primary hover:bg-mine-black'
                        )}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowSubsidiaryDropdown(false)
                setShowSearch(false)
                setShowRoleDropdown(false)
              }}
              className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className={cn(
                  "absolute top-full mt-1 bg-surface-raised border border-border rounded-lg shadow-2xl z-50 overflow-hidden",
                  isMobile ? "right-0 left-0 mx-3 fixed top-[56px] w-auto" : "right-0 w-[340px]"
                )}>
                  <div className="px-4 py-3 border-b border-border bg-mine-black/50 flex justify-between items-center">
                    <span className="text-[12px] font-semibold text-text-primary tracking-wide">Notification Center</span>
                    <span className="text-[10px] text-text-muted cursor-pointer hover:text-text-secondary">Mark all read</span>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto">
                    <NotificationItem
                      title="WCL-04 CAPA crossed SLA threshold"
                      description="Ventilation restoration CAPA (CAPA-2026-0042) is overdue."
                      time="10m ago"
                      severity="HIGH"
                      link="/capa"
                      onClick={() => setShowNotifications(false)}
                    />
                    <NotificationItem
                      title="New inspection evidence requires verification"
                      description="KD-E103 (Video) uploaded by Inspector."
                      time="2h ago"
                      severity="MEDIUM"
                      link="/evidence"
                      onClick={() => setShowNotifications(false)}
                    />
                    <NotificationItem
                      title="Monthly compliance report generated"
                      description="September 2026 report is ready for review."
                      time="5h ago"
                      severity="INFO"
                      link="/reports"
                      onClick={() => setShowNotifications(false)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Demo Mode Trigger — hidden on mobile */}
          {!demoActive && !isMobile && (
            <button
              onClick={startDemo}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber/10 hover:bg-amber/20 border border-amber/30 hover:border-amber/50 text-amber rounded text-[12px] font-semibold tracking-wide uppercase transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-amber animate-pulse"></div>
              Demo Mode
            </button>
          )}

          {/* User / Role Switcher */}
          <div className={cn("relative", !isMobile && "border-l border-border pl-4")}>
            <button 
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown)
                setShowNotifications(false)
                setShowSubsidiaryDropdown(false)
                setShowSearch(false)
              }}
              className="flex items-center gap-2 hover:bg-surface-raised p-1 rounded transition-colors"
            >
              <div className="w-8 h-8 rounded bg-slate flex items-center justify-center">
                <User className="w-4 h-4 text-text-secondary" />
              </div>
              {!isMobile && (
                <div className="hidden md:flex flex-col leading-tight text-left">
                  <span className="text-[12px] font-medium text-text-primary">{profile.name}</span>
                  <span className="text-[10px] text-text-muted">{profile.title}</span>
                </div>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-text-muted ml-1" />
            </button>
            
            {showRoleDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowRoleDropdown(false)} />
                <div className={cn(
                  "absolute top-full mt-1 bg-surface-raised border border-border rounded-lg shadow-2xl z-50 overflow-hidden",
                  isMobile ? "right-0 w-[260px]" : "right-0 w-[260px]"
                )}>
                  <div className="px-3 py-2 border-b border-border bg-mine-black/50">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Demo Role Switcher</span>
                  </div>
                  <div className="py-1">
                    {(Object.keys(roleProfiles) as Role[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRole(r)
                          setShowRoleDropdown(false)
                          navigate('/')
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-mine-black transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className={cn("text-[12px] font-medium", role === r ? "text-amber" : "text-text-primary")}>
                            {r.replace('_', ' ')}
                          </p>
                          <p className="text-[10px] text-text-muted mt-0.5">{roleProfiles[r].title}</p>
                        </div>
                        {role === r && <Check className="w-4 h-4 text-amber" />}
                      </button>
                    ))}
                  </div>

                  {/* Demo mode trigger inside role dropdown on mobile */}
                  {isMobile && !demoActive && (
                    <div className="border-t border-border p-2">
                      <button
                        onClick={() => {
                          startDemo()
                          setShowRoleDropdown(false)
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber/10 hover:bg-amber/20 border border-amber/30 text-amber rounded text-[12px] font-semibold tracking-wide uppercase transition-all"
                      >
                        <div className="w-2 h-2 rounded-full bg-amber animate-pulse"></div>
                        Demo Mode
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {mobileSearchOverlay}
    </>
  )
}

function NotificationItem({
  title,
  description,
  time,
  severity,
  link,
  onClick
}: {
  title: string
  description: string
  time: string
  severity: 'HIGH' | 'MEDIUM' | 'INFO'
  link: string
  onClick: () => void
}) {
  const navigate = useNavigate()
  
  return (
    <div 
      onClick={() => {
        onClick()
        navigate(link)
      }}
      className="px-4 py-3 border-b border-border/50 hover:bg-mine-black transition-colors cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <div
              className={cn(
                'px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase flex-shrink-0',
                severity === 'HIGH' ? 'bg-red-dim text-red-light' : 
                severity === 'MEDIUM' ? 'bg-amber-dim text-amber' : 
                'bg-blue-950 text-blue-400'
              )}
            >
              {severity}
            </div>
            <span className="text-[12px] font-medium text-text-primary group-hover:text-amber transition-colors">{title}</span>
          </div>
          <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">{description}</p>
        </div>
        <span className="text-[10px] font-mono text-text-muted flex-shrink-0 mt-1">{time}</span>
      </div>
    </div>
  )
}
