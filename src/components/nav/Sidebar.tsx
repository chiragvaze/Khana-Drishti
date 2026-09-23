import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Factory,
  Map,
  ShieldAlert,
  ClipboardCheck,
  HardHat,
  Search,
  Camera,
  Brain,
  FileBarChart,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useRole } from '../../contexts/RoleContext'
import type { Role } from '../../contexts/RoleContext'
import KhananLogo from '../shared/KhananLogo'

interface NavItem {
  icon: React.ElementType
  label: string
  path: string
  roles: Role[]
}

interface SidebarProps {
  isMobile: boolean
  isOpen: boolean
  onClose: () => void
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Command Center', path: '/dashboard', roles: ['MINE_OFFICIAL', 'CORPORATE_MANAGEMENT', 'REGULATORY_AUTHORITY'] },
  { icon: Factory, label: 'Mines', path: '/mines', roles: ['MINE_OFFICIAL', 'CORPORATE_MANAGEMENT', 'REGULATORY_AUTHORITY'] },
  { icon: Map, label: 'GIS Risk Map', path: '/map', roles: ['CORPORATE_MANAGEMENT', 'REGULATORY_AUTHORITY'] },
  { icon: ShieldAlert, label: 'Compliance & Risk', path: '/compliance', roles: ['CORPORATE_MANAGEMENT', 'REGULATORY_AUTHORITY'] },
  { icon: ClipboardCheck, label: 'CAPA', path: '/capa', roles: ['MINE_OFFICIAL', 'CORPORATE_MANAGEMENT'] },
  { icon: HardHat, label: 'Contractors', path: '/contractors', roles: ['MINE_OFFICIAL', 'CORPORATE_MANAGEMENT'] },
  { icon: Search, label: 'Inspections', path: '/inspections', roles: ['MINE_OFFICIAL', 'CORPORATE_MANAGEMENT', 'REGULATORY_AUTHORITY'] },
  { icon: Camera, label: 'Evidence', path: '/evidence', roles: ['MINE_OFFICIAL', 'CORPORATE_MANAGEMENT', 'REGULATORY_AUTHORITY'] },
  { icon: Brain, label: 'AI Insights', path: '/ai-insights', roles: ['MINE_OFFICIAL', 'CORPORATE_MANAGEMENT'] },
  { icon: FileBarChart, label: 'Reports', path: '/reports', roles: ['CORPORATE_MANAGEMENT', 'REGULATORY_AUTHORITY'] },
]

const bottomNavItems: Omit<NavItem, 'roles'>[] = [
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
]

export default function Sidebar({ isMobile, isOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { role } = useRole()

  const allowedNavItems = mainNavItems.filter((item) => item.roles.includes(role))

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.classList.add('drawer-open')
    } else {
      document.body.classList.remove('drawer-open')
    }
    return () => document.body.classList.remove('drawer-open')
  }, [isMobile, isOpen])

  // Close drawer on Escape
  useEffect(() => {
    if (!isMobile || !isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobile, isOpen, onClose])

  // Close drawer on route change
  useEffect(() => {
    if (isMobile && isOpen) {
      onClose()
    }
  }, [location.pathname])

  // ──────────────────────────────────────────────
  // Mobile Drawer
  // ──────────────────────────────────────────────
  if (isMobile) {
    if (!isOpen) return null

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer */}
        <aside
          className="fixed inset-y-0 left-0 w-[280px] max-w-[85vw] bg-mine-black border-r border-border z-50 flex flex-col animate-slide-in-left"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Header */}
          <div className="h-[56px] flex items-center justify-between px-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <KhananLogo variant="icon" size="sm" />
              <span className="font-heading text-[15px] font-bold text-text-primary tracking-wider">
                KHANAN DRISHTI
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-text-muted hover:text-text-primary transition-colors rounded-md"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main nav */}
          <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
            <div className="space-y-0.5 px-2">
              {allowedNavItems.map((item) => {
                const isActive =
                  item.path === '/dashboard'
                    ? location.pathname === '/dashboard' || location.pathname === '/'
                    : location.pathname.startsWith(item.path)

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded text-[14px] font-medium transition-colors relative group',
                      isActive
                        ? 'bg-amber-dim text-amber'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-amber rounded-r" />
                    )}
                    <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </nav>

          {/* Bottom nav */}
          <div className="border-t border-border py-3 px-2 space-y-0.5 pb-safe">
            {bottomNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path)
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded text-[14px] font-medium transition-colors relative group',
                    isActive
                      ? 'bg-amber-dim text-amber'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
                  )}
                >
                  <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        </aside>
      </>
    )
  }

  // ──────────────────────────────────────────────
  // Desktop Sidebar (original behavior preserved)
  // ──────────────────────────────────────────────
  return (
    <aside
      className={cn(
        'h-screen flex flex-col bg-mine-black border-r border-border transition-all duration-300 z-50 flex-shrink-0',
        collapsed ? 'w-[60px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center justify-center border-b border-border flex-shrink-0 px-3',
        collapsed ? 'h-[56px]' : 'h-[72px]'
      )}>
        {collapsed ? (
          <KhananLogo variant="icon" size="sm" />
        ) : (
          <div className="flex items-center gap-2">
            <KhananLogo variant="icon" size="sm" />
            <KhananLogo variant="text" size="sm" className="h-[32px]" />
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        <div className="space-y-0.5 px-2">
          {allowedNavItems.map((item) => {
            const isActive =
              item.path === '/dashboard'
                ? location.pathname === '/dashboard' || location.pathname === '/'
                : location.pathname.startsWith(item.path)

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded text-[13px] font-medium transition-colors relative group',
                  isActive
                    ? 'bg-amber-dim text-amber'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-amber rounded-r" />
                )}
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    {item.label}
                  </div>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-border py-2 px-2 space-y-0.5">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded text-[13px] font-medium transition-colors relative group',
                isActive
                  ? 'bg-amber-dim text-amber'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
              )}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.label}
                </div>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-[40px] flex items-center justify-center border-t border-border text-text-muted hover:text-text-secondary transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  )
}
