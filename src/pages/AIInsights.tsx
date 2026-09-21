import { useState, useMemo } from 'react'
import { Brain, Search, ShieldCheck, AlertTriangle, TrendingUp, Cpu } from 'lucide-react'
import { StatusBadge } from '../components/shared/StatusBadge'
import { KPICard } from '../components/shared/KPICard'
import { aiInsights } from '../data/ai-insights'
import { formatDateTime, cn } from '../lib/utils'

const categoryIcons: Record<string, React.ReactNode> = {
  SAFETY: <AlertTriangle className="w-4 h-4 text-red" />,
  COMPLIANCE: <ShieldCheck className="w-4 h-4 text-amber" />,
  ENVIRONMENTAL: <TrendingUp className="w-4 h-4 text-green" />,
  PREDICTIVE: <Brain className="w-4 h-4 text-blue-400" />,
  OPERATIONAL: <Cpu className="w-4 h-4 text-text-secondary" />,
}

export default function AIInsightsPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [severityFilter, setSeverityFilter] = useState<string>('ALL')
  const [expandedInsight, setExpandedInsight] = useState<string | null>(aiInsights[0]?.id || null)

  const filtered = useMemo(() => {
    return aiInsights.filter((i) => {
      const matchSearch =
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase()) ||
        i.mineName.toLowerCase().includes(search.toLowerCase())
      const matchCat = categoryFilter === 'ALL' || i.category === categoryFilter
      const matchSev = severityFilter === 'ALL' || i.severity === severityFilter
      return matchSearch && matchCat && matchSev
    })
  }, [search, categoryFilter, severityFilter])

  const highCount = aiInsights.filter((i) => i.severity === 'HIGH').length
  const avgConfidence = Math.round(aiInsights.reduce((s, i) => s + i.confidence, 0) / aiInsights.length)

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total AI Insights" value={aiInsights.length} icon={<Brain className="w-4 h-4" />} />
        <KPICard label="Critical/High" value={highCount} variant="danger" />
        <KPICard label="Avg. Confidence" value={`${avgConfidence}%`} subtitle="across all" />
        <KPICard label="Acted Upon" value={aiInsights.filter((i) => i.status === 'ACTED_UPON').length} variant="success" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search AI insights..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface-raised border border-border rounded text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none">
          <option value="ALL">All Categories</option>
          <option value="SAFETY">Safety</option>
          <option value="COMPLIANCE">Compliance</option>
          <option value="ENVIRONMENTAL">Environmental</option>
          <option value="PREDICTIVE">Predictive</option>
          <option value="OPERATIONAL">Operational</option>
        </select>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none">
          <option value="ALL">All Severities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Insight Cards */}
      <div className="space-y-3">
        {filtered.map((insight) => {
          const isExpanded = expandedInsight === insight.id
          return (
            <div
              key={insight.id}
              className={cn(
                'bg-surface-raised border rounded transition-all',
                insight.severity === 'HIGH' ? 'border-red/20' : 'border-border',
                isExpanded && 'border-amber/30'
              )}
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{categoryIcons[insight.category]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={insight.severity} />
                      <StatusBadge status={insight.status} />
                      <span className="text-[10px] text-text-muted">{insight.category}</span>
                      <span className="text-[10px] text-text-muted font-mono ml-auto">{insight.mineName}</span>
                    </div>
                    <h4 className="text-[13px] font-medium text-text-primary mt-2">{insight.title}</h4>
                    <p className="text-[12px] text-text-secondary mt-1 line-clamp-2">{insight.description}</p>

                    {/* Confidence Bar */}
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] text-text-muted">Confidence:</span>
                      <div className="w-32 h-2 bg-mine-black rounded overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded',
                            insight.confidence >= 90 ? 'bg-green' : insight.confidence >= 75 ? 'bg-amber' : 'bg-red'
                          )}
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-mono font-bold text-text-primary">{insight.confidence}%</span>
                      <span className="text-[10px] text-text-muted ml-auto">{formatDateTime(insight.createdDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-border mt-0">
                  <div className="pt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* AI Explanation */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-amber" />
                          <span className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">AI Explanation</span>
                        </div>
                        <p className="text-[12px] text-text-secondary leading-relaxed">{insight.explanation}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-text-muted uppercase tracking-wider">Evidence Reference</span>
                        <p className="text-[12px] text-text-primary mt-0.5">{insight.evidenceRef}</p>
                      </div>
                    </div>

                    {/* Regulation + Action */}
                    <div className="space-y-3">
                      {insight.regulationRef && (
                        <div>
                          <span className="text-[10px] text-text-muted uppercase tracking-wider">Applicable Regulation</span>
                          <p className="text-[12px] text-text-primary mt-0.5">{insight.regulationRef}</p>
                          {insight.regulationClause && (
                            <p className="text-[11px] text-amber font-mono mt-0.5">{insight.regulationClause}</p>
                          )}
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] text-text-muted uppercase tracking-wider">Recommended Action</span>
                        <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">{insight.recommendedAction}</p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button className="px-3 py-1.5 bg-amber text-mine-black text-[12px] font-medium rounded hover:bg-amber-light transition-colors">
                          Take Action
                        </button>
                        <button className="px-3 py-1.5 bg-surface-raised border border-border text-text-secondary text-[12px] rounded hover:text-text-primary transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
