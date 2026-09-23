import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/nav/Sidebar'
import TopBar from '../components/nav/TopBar'
import { ToastProvider } from '../components/ui/ToastProvider'
import { DemoProvider } from '../contexts/DemoContext'
import { DemoOverlays, DemoControlBar } from '../components/ui/DemoOverlays'
import { useIsMobile } from '../lib/useIsMobile'

export default function DashboardLayout() {
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <DemoProvider>
      <ToastProvider>
        <div className="flex h-screen h-[100dvh] w-screen overflow-hidden">
          {/* Desktop sidebar — permanently visible in layout flow */}
          {!isMobile && <Sidebar isMobile={false} isOpen={true} onClose={() => {}} />}

          {/* Mobile drawer — overlay, not in layout flow */}
          {isMobile && (
            <Sidebar
              isMobile={true}
              isOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
            />
          )}

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <TopBar isMobile={isMobile} onMenuToggle={() => setMobileMenuOpen(true)} />
            <main className="flex-1 overflow-y-auto overflow-x-hidden bg-mine-black-light p-3 sm:p-4 lg:p-5">
              <Outlet />
            </main>
            {/* Demo Mode Indicator */}
            <div className="h-[28px] bg-amber-dim border-t border-amber/20 flex items-center justify-center gap-3 flex-shrink-0 select-none">
              <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              <span className="text-[10px] font-mono font-semibold text-amber uppercase tracking-[0.2em] hidden sm:inline">
                Prototype / Demo Data — Smart India Hackathon 2026
              </span>
              <span className="text-[9px] font-mono font-semibold text-amber uppercase tracking-wider sm:hidden">
                SIH 2026 Prototype
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
            </div>
          </div>
        </div>
        <DemoOverlays />
        <DemoControlBar />
      </ToastProvider>
    </DemoProvider>
  )
}
