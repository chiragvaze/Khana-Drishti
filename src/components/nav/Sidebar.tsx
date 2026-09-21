import { useState } from 'react'
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
  Pickaxe,
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface NavItem {
  icon: React.ElementType
  label: string
  path: string
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Command Center', path: '/' },
  { icon: Factory, label: 'Mines', path: '/mines' },
  { icon: Map, label: 'GIS Risk Map', path: '/gis' },
  { icon: ShieldAlert, label: 'Compliance & Risk', path: '/compliance' },
  { icon: ClipboardCheck, label: 'CAPA', path: '/capa' },
  { icon: HardHat, label: 'Contractors', path: '/contractors' },
  { icon: Search, label: 'Inspections', path: '/inspections' },
  { icon: Camera, label: 'Evidence', path: '/evidence' },
  { icon: Brain, label: 'AI Insights', path: '/ai-insights' },
  { icon: FileBarChart, label: 'Reports', path: '/reports' },
]

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <aside
      className={cn(
        'h-screen flex flex-col bg-mine-black border-r border-border transition-all duration-300 z-50 flex-shrink-0',
        collapsed ? 'w-[60px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className="h-[56px] flex items-center gap-2 px-4 border-b border-border flex-shrink-0">
        <Pickaxe className="w-6 h-6 text-amber flex-shrink-0" />
        {!collapsed && (
          <div className="flex flex-col leading-tight overflow-hidden">
            <span className="font-heading text-[15px] font-bold text-text-primary tracking-wider">
              KHANAN DRISHTI
            </span>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        <div className="space-y-0.5 px-2">
          {mainNavItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
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
