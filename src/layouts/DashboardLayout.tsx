import { Outlet } from 'react-router-dom'
import Sidebar from '../components/nav/Sidebar'
import TopBar from '../components/nav/TopBar'
import { ToastProvider } from '../components/ui/ToastProvider'
import { DemoProvider } from '../contexts/DemoContext'
import { DemoOverlays, DemoControlBar } from '../components/ui/DemoOverlays'

export default function DashboardLayout() {
  return (
    <DemoProvider>
      <ToastProvider>
        <div className="flex h-screen w-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-y-auto overflow-x-hidden bg-mine-black-light p-5">
              <Outlet />
            </main>
            {/* Demo Mode Indicator */}
            <div className="h-[28px] bg-amber-dim border-t border-amber/20 flex items-center justify-center gap-3 flex-shrink-0 select-none">
              <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              <span className="text-[10px] font-mono font-semibold text-amber uppercase tracking-[0.2em]">
                Prototype / Demo Data — Smart India Hackathon 2026
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
