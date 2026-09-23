import { User, Bell, Shield, Info } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { useLocation } from 'react-router-dom'
import { useRole } from '../contexts/RoleContext'

export default function SettingsPage() {
  const location = useLocation()
  const { role } = useRole()
  const isHelp = location.pathname === '/help'
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyDashboard, setNotifyDashboard] = useState(true)
  const [notifySMS, setNotifySMS] = useState(false)

  const profiles = {
    MINE_OFFICIAL: { name: 'A.K. Sharma', title: 'Mine Manager, WCL-04', email: 'ak.sharma@wcl.coalindia.in', phone: '+91-712-2XXXXXX' },
    CORPORATE_MANAGEMENT: { name: 'Shri V.K. Patel', title: 'Director (Technical), CIL', email: 'vk.patel@coalindia.in', phone: '+91-33-2248-XXXX' },
    REGULATORY_AUTHORITY: { name: 'Dr. R. Singh', title: 'Director General, DGMS', email: 'dg@dgms.gov.in', phone: '+91-326-2XXXXXX' },
  }
  const profile = profiles[role]

  if (isHelp) {
    return (
      <div className="max-w-3xl space-y-5">
        <div className="bg-surface-raised border border-border rounded p-6">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-6 h-6 text-amber" />
            <h2 className="font-heading text-[20px] font-bold text-text-primary tracking-wide">HELP & SUPPORT</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-mine-black rounded border border-border">
              <h3 className="text-[14px] font-medium text-text-primary mb-2">About Khanan Drishti</h3>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                Khanan Drishti is an AI-based Smart Governance and Compliance Monitoring System for Indian coal mines.
                The platform connects field-level inspections and evidence with a centralized governance dashboard,
                enabling real-time compliance monitoring, risk assessment, and corrective action tracking.
              </p>
            </div>

            <div className="p-4 bg-mine-black rounded border border-border">
              <h3 className="text-[14px] font-medium text-text-primary mb-2">Key Features</h3>
              <ul className="space-y-2 text-[12px] text-text-secondary">
                <li>• <strong className="text-text-primary">Command Center</strong> — Real-time operational dashboard with KPIs and alerts</li>
                <li>• <strong className="text-text-primary">AI-Powered Insights</strong> — Automated risk detection with confidence scores</li>
                <li>• <strong className="text-text-primary">Compliance Tracking</strong> — CMR 2017 and DGMS regulation monitoring</li>
                <li>• <strong className="text-text-primary">CAPA Management</strong> — Corrective actions with SLA tracking</li>
                <li>• <strong className="text-text-primary">GIS Risk Map</strong> — Geographical risk visualization</li>
                <li>• <strong className="text-text-primary">Evidence Management</strong> — AI-analyzed field evidence</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-dim border border-amber/20 rounded">
              <h3 className="text-[14px] font-medium text-amber mb-1">Smart India Hackathon — Prototype</h3>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                This is a prototype developed for the Smart India Hackathon. All data shown is sample/demo data
                and does not represent actual government statistics or real mine operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-5">
      {/* User Profile */}
      <div className="bg-surface-raised border border-border rounded p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-amber" />
          <h2 className="font-heading text-[16px] font-bold text-text-primary tracking-wide">USER PROFILE</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-text-muted uppercase tracking-wider">Name</label>
            <p className="text-[13px] text-text-primary mt-0.5">{profile.name}</p>
          </div>
          <div>
            <label className="text-[10px] text-text-muted uppercase tracking-wider">Role</label>
            <p className="text-[13px] text-text-primary mt-0.5">{profile.title}</p>
          </div>
          <div>
            <label className="text-[10px] text-text-muted uppercase tracking-wider">Email</label>
            <p className="text-[13px] text-text-primary mt-0.5">{profile.email}</p>
          </div>
          <div>
            <label className="text-[10px] text-text-muted uppercase tracking-wider">Phone</label>
            <p className="text-[13px] text-text-primary mt-0.5">{profile.phone}</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-surface-raised border border-border rounded p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-amber" />
          <h2 className="font-heading text-[16px] font-bold text-text-primary tracking-wide">NOTIFICATION PREFERENCES</h2>
        </div>
        <div className="space-y-3">
          <ToggleRow label="Email Notifications" description="Receive alerts and reports via email" checked={notifyEmail} onChange={setNotifyEmail} />
          <ToggleRow label="Dashboard Notifications" description="Show real-time alerts on dashboard" checked={notifyDashboard} onChange={setNotifyDashboard} />
          <ToggleRow label="SMS Notifications" description="Receive critical alerts via SMS" checked={notifySMS} onChange={setNotifySMS} />
        </div>
      </div>

      {/* System Info */}
      <div className="bg-surface-raised border border-border rounded p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-amber" />
          <h2 className="font-heading text-[16px] font-bold text-text-primary tracking-wide">SYSTEM INFORMATION</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px]">
          <div>
            <span className="text-text-muted">Version</span>
            <p className="text-text-primary font-mono">1.0.0-beta (SIH Demo)</p>
          </div>
          <div>
            <span className="text-text-muted">Environment</span>
            <p className="text-text-primary font-mono">Demo / Prototype</p>
          </div>
          <div>
            <span className="text-text-muted">AI Engine</span>
            <p className="text-text-primary font-mono">KD-AI v2.1</p>
          </div>
          <div>
            <span className="text-text-muted">Last Updated</span>
            <p className="text-text-primary font-mono">21 Sep 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-[13px] text-text-primary">{label}</p>
        <p className="text-[11px] text-text-muted">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'w-10 h-5 rounded-full transition-colors relative',
          checked ? 'bg-amber' : 'bg-slate'
        )}
      >
        <div
          className={cn(
            'w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all',
            checked ? 'left-5.5' : 'left-0.5'
          )}
        />
      </button>
    </div>
  )
}
