import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Factory,
  ClipboardCheck,
  ShieldAlert,
  Brain,
  Activity,
  Clock,
  ArrowRight,
  Flame,
  FileDown,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { KPICard } from '../components/shared/KPICard'
import { StatusBadge } from '../components/shared/StatusBadge'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { useToast } from '../components/ui/ToastProvider'
import { mines } from '../data/mines'
import { riskAlerts, recentActivity } from '../data/risk-alerts'
import { capas } from '../data/capas'
import { observations } from '../data/observations'
import { aiInsights } from '../data/ai-insights'
import { formatDateTime, daysUntil } from '../lib/utils'

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

const inspectionFrequency = [
  { week: 'W33', count: 3 },
  { week: 'W34', count: 5 },
  { week: 'W35', count: 2 },
  { week: 'W36', count: 4 },
  { week: 'W37', count: 6 },
  { week: 'W38', count: 4 },
]

export default function CommandCenter() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedAlertTab, setSelectedAlertTab] = useState<'active' | 'acknowledged'>('active')

  const activeAlerts = riskAlerts.filter((a) => a.status === 'ACTIVE')
  const acknowledgedAlerts = riskAlerts.filter((a) => a.status === 'ACKNOWLEDGED')
  const displayAlerts = selectedAlertTab === 'active' ? activeAlerts : acknowledgedAlerts

  const openCAPAs = capas.filter((c) => c.status !== 'CLOSED')
  const highRiskObs = observations.filter((o) => o.riskLevel === 'HIGH')
  const avgCompliance = Math.round(mines.reduce((sum, m) => sum + m.complianceScore, 0) / mines.length)

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'The dashboard report is being generated.',
      type: 'info'
    })
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: 'Dashboard report downloaded successfully.',
        type: 'success'
      })
    }, 2000)
  }

  return (
    <div className="space-y-5">
      <PageHeader 
        title="Command Center" 
        description="Real-time overview of mine safety and compliance across all operations."
      >
        <Button onClick={handleExport} variant="outline" size="sm">
          <FileDown className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </PageHeader>

      {/* Critical Alert Banner */}
      <Card className="bg-red-dim border-red/30">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="p-2 bg-red/20 rounded">
            <Flame className="w-5 h-5 text-red" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading text-[15px] font-bold text-red-light tracking-wide">
                CRITICAL ALERT — IMMEDIATE ACTION REQUIRED
              </h3>
              <StatusBadge status="HIGH" />
            </div>
            <p className="text-[13px] text-text-primary leading-relaxed">
              Unsafe ventilation condition detected at <strong>WCL-04 (Wani Opencast Extension)</strong>, Panel 3B.
              AI analysis predicts methane levels will exceed 1.25% statutory threshold within 18 hours.
              CAPA assigned to Sharma Mining Services — SLA: {daysUntil('2026-09-22')} days remaining.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => navigate('/mines/mine-wcl-04')}
                variant="destructive"
                size="sm"
                className="gap-1"
              >
                View Mine Detail <ArrowRight className="w-3 h-3" />
              </Button>
              <Button
                onClick={() => navigate('/capa')}
                variant="outline"
                size="sm"
              >
                View CAPA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard
          label="Total Mines"
          value={mines.length}
          subtitle="monitored"
          icon={<Factory className="w-4 h-4" />}
          trend="neutral"
          trendValue="Stable"
        />
        <KPICard
          label="Active Inspections"
          value={2}
          subtitle="this week"
          icon={<ClipboardCheck className="w-4 h-4" />}
          trend="up"
          trendValue="+1 from last week"
          trendPositive
        />
        <KPICard
          label="Open CAPAs"
          value={openCAPAs.length}
          subtitle={`${capas.filter(c => c.status === 'OVERDUE').length} overdue`}
          icon={<AlertTriangle className="w-4 h-4" />}
          variant="warning"
          trend="up"
          trendValue="+2 this month"
          trendPositive={false}
        />
        <KPICard
          label="Compliance Score"
          value={`${avgCompliance}%`}
          subtitle="avg. across mines"
          icon={<ShieldAlert className="w-4 h-4" />}
          variant={avgCompliance >= 80 ? 'success' : avgCompliance >= 60 ? 'warning' : 'danger'}
          trend="down"
          trendValue="-4% from Aug"
          trendPositive={false}
        />
        <KPICard
          label="Critical Alerts"
          value={activeAlerts.filter(a => a.severity === 'HIGH').length}
          subtitle="active"
          icon={<Flame className="w-4 h-4" />}
          variant="danger"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Compliance Trend */}
        <div className="bg-surface-raised border border-border rounded p-4">
          <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-3">
            COMPLIANCE TREND
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={complianceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1C2530', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 12 }}
                labelStyle={{ color: '#EDE6DA' }}
              />
              <Line type="monotone" dataKey="score" stroke="#F0A202" strokeWidth={2} dot={{ r: 3, fill: '#F0A202' }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-text-muted mt-1">Sample data — Demo projection</p>
        </div>

        {/* Risk Distribution */}
        <div className="bg-surface-raised border border-border rounded p-4">
          <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-3">
            MINE RISK DISTRIBUTION
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">
                {riskDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1C2530', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 12 }} />
              <Legend iconType="square" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CAPA Status */}
        <div className="bg-surface-raised border border-border rounded p-4">
          <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-3">
            CAPA STATUS
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={capaStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="status" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1C2530', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 12 }} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {capaStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inspection Frequency */}
        <div className="bg-surface-raised border border-border rounded p-4">
          <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider mb-3">
            WEEKLY INSPECTIONS
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={inspectionFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1C2530', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 12 }} />
              <Bar dataKey="count" fill="#2E7D4F" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-text-muted mt-1">Sample data — Demo projection</p>
        </div>
      </div>

      {/* Lower Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Risk Alerts */}
        <div className="bg-surface-raised border border-border rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber" />
              RISK ALERTS
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedAlertTab('active')}
                className={`px-2 py-0.5 text-[10px] rounded ${selectedAlertTab === 'active' ? 'bg-amber-dim text-amber' : 'text-text-muted hover:text-text-secondary'}`}
              >
                Active ({activeAlerts.length})
              </button>
              <button
                onClick={() => setSelectedAlertTab('acknowledged')}
                className={`px-2 py-0.5 text-[10px] rounded ${selectedAlertTab === 'acknowledged' ? 'bg-amber-dim text-amber' : 'text-text-muted hover:text-text-secondary'}`}
              >
                Acknowledged ({acknowledgedAlerts.length})
              </button>
            </div>
          </div>
          <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
            {displayAlerts.map((alert) => (
              <div key={alert.id} className="px-4 py-3 hover:bg-mine-black/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${alert.severity === 'HIGH' ? 'bg-red' : 'bg-amber'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-text-primary truncate">{alert.title}</p>
                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{alert.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StatusBadge status={alert.severity} />
                      <span className="text-[10px] text-text-muted font-mono">{alert.mineName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Observations */}
        <div className="bg-surface-raised border border-border rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red" />
              HIGH-RISK OBSERVATIONS
            </h3>
          </div>
          <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
            {highRiskObs.map((obs) => (
              <div key={obs.id} className="px-4 py-3 hover:bg-mine-black/50 transition-colors cursor-pointer">
                <p className="text-[12px] font-medium text-text-primary">{obs.title}</p>
                <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{obs.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusBadge status={obs.status} />
                  <span className="text-[10px] text-text-muted font-mono">{obs.mineName}</span>
                  {obs.aiVerified && (
                    <span className="text-[10px] text-green-light flex items-center gap-0.5">
                      <Brain className="w-3 h-3" /> AI Verified ({obs.aiConfidence}%)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-raised border border-border rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber" />
              RECENT ACTIVITY
            </h3>
          </div>
          <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
            {recentActivity.slice(0, 8).map((item) => (
              <div key={item.id} className="px-4 py-3 hover:bg-mine-black/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">{getActivityIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-text-primary">{item.title}</p>
                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-text-muted" />
                      <span className="text-[10px] text-text-muted font-mono">{formatDateTime(item.timestamp)}</span>
                      <span className="text-[10px] text-text-muted">• {item.mineName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights + SLA Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* AI Insights */}
        <div className="bg-surface-raised border border-border rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber" />
              LATEST AI INSIGHTS
            </h3>
            <button onClick={() => navigate('/ai-insights')} className="text-[11px] text-amber hover:text-amber-light flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {aiInsights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="px-4 py-3 hover:bg-mine-black/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12px] font-medium text-text-primary flex-1">{insight.title}</p>
                  <StatusBadge status={insight.severity} />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-text-muted">Confidence:</span>
                    <div className="w-16 h-1.5 bg-mine-black rounded overflow-hidden">
                      <div
                        className="h-full bg-amber rounded"
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-amber">{insight.confidence}%</span>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono">{insight.mineName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Tracker */}
        <div className="bg-surface-raised border border-border rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-heading text-[13px] font-semibold text-text-secondary tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber" />
              CAPA SLA TRACKER
            </h3>
          </div>
          <div className="divide-y divide-border">
            {openCAPAs.map((capa) => {
              const daysLeft = daysUntil(capa.dueDate)
              const isOverdue = daysLeft < 0
              return (
                <div key={capa.id} className="px-4 py-3 hover:bg-mine-black/50 transition-colors cursor-pointer" onClick={() => navigate('/capa')}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-text-primary truncate">{capa.title}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{capa.mineName} • {capa.assignedContractor}</p>
                    </div>
                    <StatusBadge status={capa.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-mine-black rounded overflow-hidden">
                      <div
                        className={`h-full rounded ${isOverdue ? 'bg-red' : daysLeft <= 2 ? 'bg-amber' : 'bg-green'}`}
                        style={{ width: `${capa.progressPercent}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-mono ${isOverdue ? 'text-red' : daysLeft <= 2 ? 'text-amber' : 'text-green'}`}>
                      {isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">{capa.progressPercent}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function getActivityIcon(type: string) {
  const iconClass = 'w-3.5 h-3.5'
  switch (type) {
    case 'ALERT': return <AlertTriangle className={`${iconClass} text-red`} />
    case 'INSPECTION': return <ClipboardCheck className={`${iconClass} text-amber`} />
    case 'CAPA': return <ClipboardCheck className={`${iconClass} text-blue-400`} />
    case 'AI_INSIGHT': return <Brain className={`${iconClass} text-amber`} />
    case 'OBSERVATION': return <ShieldAlert className={`${iconClass} text-amber`} />
    case 'REPORT': return <Activity className={`${iconClass} text-green`} />
    default: return <Activity className={`${iconClass} text-text-muted`} />
  }
}
