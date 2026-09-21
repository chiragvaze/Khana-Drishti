import { Outlet } from 'react-router-dom'
import Sidebar from '../components/nav/Sidebar'
import TopBar from '../components/nav/TopBar'
import { ToastProvider } from '../components/ui/ToastProvider'

export default function DashboardLayout() {
  return (
    <ToastProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-mine-black-light p-5">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
