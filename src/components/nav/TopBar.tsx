import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, ChevronDown, User, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

const routeTitles: Record<string, string> = {
  '/': 'Command Center',
  '/mines': 'Mines',
  '/gis': 'GIS Risk Map',
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

export default function TopBar() {
  const location = useLocation()
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('All Subsidiaries')
  const [showSubsidiaryDropdown, setShowSubsidiaryDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const pathParts = location.pathname.split('/').filter(Boolean)
  const currentTitle =
    routeTitles[location.pathname] ||
    (pathParts.length > 1 ? 'Mine Detail' : 'Dashboard')

  const breadcrumbs = [
    'Khanan Drishti',
    ...(currentTitle !== 'Command Center' ? [currentTitle] : []),
  ]

  return (
    <header className="h-[56px] bg-mine-black border-b border-border flex items-center justify-between px-5 flex-shrink-0">
      {/* Left: Title + Breadcrumb */}
      <div className="flex flex-col justify-center">
        <h1 className="text-[18px] font-heading font-bold text-text-primary tracking-wide leading-tight">
          {currentTitle}
        </h1>
        <div className="flex items-center gap-1 text-[11px] text-text-muted">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3" />}
              <span className={i === breadcrumbs.length - 1 ? 'text-text-secondary' : ''}>
                {crumb}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Subsidiary Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSubsidiaryDropdown(!showSubsidiaryDropdown)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-raised border border-border rounded text-[12px] text-text-secondary hover:text-text-primary transition-colors"
          >
            <span className="max-w-[160px] truncate">{selectedSubsidiary}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showSubsidiaryDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSubsidiaryDropdown(false)} />
              <div className="absolute right-0 top-full mt-1 w-[240px] bg-surface-raised border border-border rounded shadow-2xl z-50 py-1">
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

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowSubsidiaryDropdown(false)
            }}
            className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-1 w-[320px] bg-surface-raised border border-border rounded shadow-2xl z-50">
                <div className="px-3 py-2 border-b border-border">
                  <span className="text-[12px] font-semibold text-text-primary">Notifications</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  <NotificationItem
                    title="Critical: WCL-04 Ventilation Alert"
                    description="Methane levels approaching threshold in Panel 3B"
                    time="2h ago"
                    severity="HIGH"
                  />
                  <NotificationItem
                    title="CAPA Overdue: BCCL-06 FR Cables"
                    description="FR cable installation 22 days past deadline"
                    time="5h ago"
                    severity="HIGH"
                  />
                  <NotificationItem
                    title="Follow-up inspection scheduled"
                    description="WCL-04 ventilation CAPA verification"
                    time="1d ago"
                    severity="MEDIUM"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded bg-slate flex items-center justify-center">
            <User className="w-4 h-4 text-text-secondary" />
          </div>
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-[12px] font-medium text-text-primary">Shri V.K. Patel</span>
            <span className="text-[10px] text-text-muted">Director (Technical), CIL</span>
          </div>
        </div>
      </div>
    </header>
  )
}

function NotificationItem({
  title,
  description,
  time,
  severity,
}: {
  title: string
  description: string
  time: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
}) {
  return (
    <div className="px-3 py-2.5 border-b border-border hover:bg-mine-black transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full flex-shrink-0',
                severity === 'HIGH' ? 'bg-red' : severity === 'MEDIUM' ? 'bg-amber' : 'bg-green'
              )}
            />
            <span className="text-[12px] font-medium text-text-primary truncate">{title}</span>
          </div>
          <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{description}</p>
        </div>
        <span className="text-[10px] text-text-muted flex-shrink-0">{time}</span>
      </div>
    </div>
  )
}
