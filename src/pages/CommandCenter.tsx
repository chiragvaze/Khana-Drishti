import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Factory,
  ClipboardCheck,
  ShieldAlert,
  Brain,
  ArrowRight,
  Flame,
  FileDown,
  ListTodo,
  FileCheck,
  HardHat,
  Database
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { KPICard } from '../components/shared/KPICard'
import { StatusBadge } from '../components/shared/StatusBadge'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { DataTable } from '../components/ui/DataTable'
import { useToast } from '../components/ui/ToastProvider'
import { mines } from '../data/mines'
import { riskAlerts } from '../data/risk-alerts'
import { capas } from '../data/capas'
import { useRole } from '../contexts/RoleContext'
import DemoHighlight from '../components/shared/DemoHighlight'

// Data mocks
const complianceTrend = [
  { month: 'Apr', score: 74 },
  { month: 'May', score: 76 },
  { month: 'Jun', score: 73 },
  { month: 'Jul', score: 78 },
  { month: 'Aug', score: 80 },
  { month: 'Sep', score: 76 },
]
const riskDistribution = [
  { name: 'High', value: 3, color: '#C1292E' },
  { name: 'Medium', value: 4, color: '#F0A202' },
  { name: 'Low', value: 3, color: '#2E7D4F' },
]
const capaStatusData = [
  { status: 'Open', count: 2, color: '#F0A202' },
  { status: 'In Progress', count: 2, color: '#3B82F6' },
  { status: 'Overdue', count: 1, color: '#C1292E' },
  { status: 'Closed', count: 2, color: '#2E7D4F' },
]

export default function CommandCenter() {
  const { role } = useRole()
  
  if (role === 'MINE_OFFICIAL') return <MineOfficialDashboard />
  if (role === 'REGULATORY_AUTHORITY') return <RegulatoryDashboard />
  
  return <CorporateDashboard />
}

function CorporateDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const highRiskMines = mines.filter(m => m.riskLevel === 'HIGH')
  const openCAPAs = capas.filter(c => c.status !== 'CLOSED')
  const overdueCAPAs = capas.filter(c => c.status === 'OVERDUE')
  const avgCompliance = Math.round(mines.reduce((sum, m) => sum + m.complianceScore, 0) / mines.length)

  const handleExport = () => {
    toast({ title: 'Export Started', description: 'The dashboard report is being generated.', type: 'info' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Corporate Command Center" 
        description="Network-wide overview of mine safety and compliance."
      >
        <Button onClick={handleExport} variant="outline" size="sm">
          <FileDown className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </PageHeader>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Mines Monitored" value={mines.length} subtitle="Active tracking" icon={<Factory className="w-4 h-4" />} trend="neutral" trendValue="Stable" />
        <KPICard label="High Risk Mines" value={highRiskMines.length} subtitle="Require attention" icon={<AlertTriangle className="w-4 h-4" />} trend="up" trendValue="+1 this month" variant="danger" />
        <KPICard label="Open CAPA" value={openCAPAs.length} subtitle={`${overdueCAPAs.length} overdue`} icon={<ClipboardCheck className="w-4 h-4" />} trend="down" trendValue="-2 this week" variant="warning" />
        <KPICard label="Compliance Rate" value={`${avgCompliance}%`} subtitle="Network average" icon={<ShieldAlert className="w-4 h-4" />} trend="up" trendValue="+1.2% from Aug" variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Overview */}
        <div className="lg:col-span-2 bg-surface-raised border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-mine-black/30">
            <h3 className="text-[13px] font-heading font-semibold text-text-secondary tracking-wider">NETWORK RISK OVERVIEW</h3>
          </div>
          <div className="p-6 flex-1 border-b border-border min-h-[300px] flex flex-col justify-center relative bg-mine-black/20">
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber/20 via-mine-black to-mine-black" />
            <div className="relative w-full max-w-2xl mx-auto space-y-3 z-10">
              <DemoHighlight step={1} tooltip="An inspection finding has increased the compliance risk of WCL-04.">
                <div className="bg-red-dim border border-red/30 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-red/10 transition-colors shadow-lg shadow-red/5" onClick={() => navigate('/mines/mine-wcl-04')}>
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
                    <div>
                      <h4 className="text-[15px] font-medium text-text-primary font-mono tracking-wide">WCL-04 Wani Opencast</h4>
                      <p className="text-[12px] text-red-light mt-0.5 font-medium">Critical Risk • 65% Compliance</p>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">View Mine</Button>
                </div>
              </DemoHighlight>
              <div className="bg-amber-dim border border-amber/30 p-4 rounded-lg flex items-center justify-between opacity-90 cursor-pointer hover:opacity-100 transition-opacity" onClick={() => navigate('/mines/mine-ncl-12')}>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-amber" />
                  <div>
                    <h4 className="text-[14px] font-medium text-text-primary font-mono tracking-wide">NCL-12 Jayant Opencast</h4>
                    <p className="text-[12px] text-amber-light mt-0.5">Medium Risk • 74% Compliance</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Mine</Button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Risk Alerts */}
        <div className="lg:col-span-1 bg-surface-raised border border-border rounded-lg flex flex-col">
          <div className="p-4 border-b border-border bg-red-dim/20">
            <h3 className="text-[13px] font-heading font-semibold text-text-primary tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber animate-pulse" /> AI RISK ALERTS
            </h3>
          </div>
          <div className="divide-y divide-border overflow-y-auto max-h-[300px]">
            {riskAlerts.slice(0,4).map(alert => (
              <div key={alert.id} className="p-4 hover:bg-mine-black/50 transition-colors cursor-pointer group" onClick={() => navigate('/ai-insights')}>
                <div className="flex items-start gap-2 mb-1.5">
                  <StatusBadge status={alert.severity} />
                  <span className="text-[10px] text-text-muted font-mono mt-0.5">{alert.mineName}</span>
                </div>
                <p className="text-[13px] font-medium text-text-primary mb-1.5 group-hover:text-amber transition-colors">{alert.title}</p>
                <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-raised border border-border rounded p-4">
          <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-3">COMPLIANCE TREND</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={complianceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#808f9f' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#808f9f' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1C2530', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 12 }} labelStyle={{ color: '#EDE6DA' }} />
              <Line type="monotone" dataKey="score" stroke="#F0A202" strokeWidth={2} dot={{ r: 4, fill: '#F0A202', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface-raised border border-border rounded p-4">
          <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-3">CAPA STATUS</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={capaStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#808f9f' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#808f9f' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1C2530', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 12 }} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={40}>
                {capaStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface-raised border border-border rounded p-4">
          <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-3">RISK DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                {riskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1C2530', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 12 }} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function MineOfficialDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Mine Operations Center: WCL-04" 
        description="Daily operational tracking and compliance execution for Wani Opencast Extension."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="My Compliance Score" value="65%" subtitle="Below target (75%)" icon={<ShieldAlert className="w-4 h-4" />} trend="down" trendValue="-2% this month" variant="danger" />
        <KPICard label="Open Observations" value={4} subtitle="From recent inspection" icon={<AlertTriangle className="w-4 h-4" />} variant="warning" />
        <KPICard label="My CAPA Pending" value={2} subtitle="1 Overdue" icon={<ClipboardCheck className="w-4 h-4" />} variant="danger" />
        <KPICard label="Active Contractors" value={3} subtitle="1 expiring soon" icon={<HardHat className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Priority Actions */}
        <div className="bg-surface-raised border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-amber" /> MY PENDING ACTIONS
            </h3>
          </div>
          <div className="divide-y divide-border">
            <div className="p-4 hover:bg-mine-black/50 cursor-pointer flex items-center justify-between group" onClick={() => navigate('/capa')}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-dim border border-red/20 flex items-center justify-center text-red font-bold text-lg shadow-inner">!</div>
                <div>
                  <p className="text-[14px] font-medium text-text-primary">Resolve Overdue Ventilation CAPA</p>
                  <p className="text-[12px] text-text-muted mt-0.5">Submit evidence of ducting repair (Due: 3 days ago)</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-amber transition-colors" />
            </div>
            <div className="p-4 hover:bg-mine-black/50 cursor-pointer flex items-center justify-between group" onClick={() => navigate('/evidence')}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-dim border border-amber/20 flex items-center justify-center text-amber font-bold text-lg shadow-inner">2</div>
                <div>
                  <p className="text-[14px] font-medium text-text-primary">Verify Inspection Evidence</p>
                  <p className="text-[12px] text-text-muted mt-0.5">Validate KD-E102 and KD-E103</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-amber transition-colors" />
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-surface-raised border border-border rounded-lg relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="px-4 py-3 border-b border-border relative z-10 bg-mine-black/40">
            <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-red-light" /> MINE AI PREDICTION
            </h3>
          </div>
          <div className="p-6 relative z-10 flex-1 flex flex-col justify-center">
            <p className="text-[16px] leading-relaxed text-text-primary mb-6 font-medium tracking-wide">
              "Ventilation failure risk is <strong className="text-red-light">CRITICAL</strong>. Methane levels will likely exceed 1.25% threshold within 18 hours if ducting remains unrepaired."
            </p>
            <div className="flex flex-wrap items-center gap-5 text-[12px] bg-mine-black/50 p-4 rounded-md border border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-text-muted">Recommendation:</span>
                <span className="text-amber font-medium">Immediate Panel 3B Evacuation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RegulatoryDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Regulatory Oversight Dashboard" 
        description="National compliance, statutory reporting, and inspection oversight for DGMS."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Mines Under Watch" value={8} subtitle="Targeted monitoring" icon={<Database className="w-4 h-4" />} trend="up" trendValue="High priority" variant="danger" />
        <KPICard label="Inspections Planned" value={14} subtitle="This quarter" icon={<ClipboardCheck className="w-4 h-4" />} />
        <KPICard label="Statutory Returns" value={1} subtitle="Overdue across network" icon={<FileCheck className="w-4 h-4" />} variant="warning" />
        <KPICard label="Avg. Compliance" value="76%" subtitle="National baseline" icon={<ShieldAlert className="w-4 h-4" />} trend="neutral" trendValue="Stable" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface-raised border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-mine-black/30 flex justify-between items-center">
            <h3 className="text-[13px] font-heading font-semibold text-text-secondary tracking-wider">COMPLIANCE WATCHLIST</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/compliance')}>View All</Button>
          </div>
          <DataTable
            columns={[
              { header: 'Mine', accessorKey: 'mineCode', cell: (val) => <span className="font-bold font-mono">{String(val.mineCode)}</span> },
              { header: 'Compliance Score', accessorKey: 'score', cell: (val) => <span className={Number(val.score) < 70 ? 'text-red' : 'text-amber'}>{String(val.score)}%</span> },
              { header: 'Risk Status', accessorKey: 'riskLevel', cell: (val) => <StatusBadge status={val.riskLevel as 'HIGH' | 'MEDIUM' | 'LOW'} /> },
              { header: 'Last Inspection', accessorKey: 'lastInspection' },
            ]}
            data={[
              { id: '1', mineCode: 'WCL-04', score: 65, riskLevel: 'HIGH', lastInspection: '2026-09-18' },
              { id: '2', mineCode: 'BCCL-06', score: 68, riskLevel: 'HIGH', lastInspection: '2026-09-16' },
              { id: '3', mineCode: 'ECL-03', score: 72, riskLevel: 'MEDIUM', lastInspection: '2026-09-12' },
            ]}
          />
        </div>

        <div className="bg-surface-raised border border-border rounded-lg flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="text-[13px] font-heading font-semibold text-text-secondary tracking-wider">RECENT REPORTS</h3>
          </div>
          <div className="divide-y divide-border overflow-y-auto max-h-[300px]">
            <div className="p-4 hover:bg-mine-black/50 cursor-pointer" onClick={() => navigate('/reports')}>
              <p className="text-[13px] font-medium text-text-primary">WCL-04 Monthly Compliance</p>
              <p className="text-[11px] text-text-muted mt-1">Submitted: 2026-09-20</p>
            </div>
            <div className="p-4 hover:bg-mine-black/50 cursor-pointer" onClick={() => navigate('/reports')}>
              <p className="text-[13px] font-medium text-text-primary">Q3 Inspection Summary - SECL</p>
              <p className="text-[11px] text-text-muted mt-1">Submitted: 2026-09-15</p>
            </div>
            <div className="p-4 hover:bg-mine-black/50 cursor-pointer" onClick={() => navigate('/reports')}>
              <p className="text-[13px] font-medium text-text-primary text-red-light">DGMS Annual Return (Pending)</p>
              <p className="text-[11px] text-red-light/70 mt-1">Due: 2026-09-30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
