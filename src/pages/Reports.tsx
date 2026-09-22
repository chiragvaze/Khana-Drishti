import { useState } from 'react'
import { Download, Eye, Plus, ChevronLeft, ShieldCheck, AlertTriangle, FileText, HardHat, FileCheck } from 'lucide-react'
import { StatusBadge } from '../components/shared/StatusBadge'
import { formatDate } from '../lib/utils'

const reportTypeLabels: Record<string, string> = {
  COMPLIANCE: 'Compliance',
  RISK_ASSESSMENT: 'Risk Assessment',
  INSPECTION_SUMMARY: 'Inspection Summary',
  CAPA_STATUS: 'CAPA Status',
  MONTHLY_REVIEW: 'Monthly Review',
  DGMS_RETURN: 'DGMS Return',
  CONTRACTOR_COMPLIANCE: 'Contractor Compliance',
  MINE_RISK: 'Mine Risk',
}

export default function Reports() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Inject requested reports into the list for the UI
  const displayReports = [
    { id: 'r1', name: 'Monthly Compliance Report', type: 'COMPLIANCE', period: 'September 2026', generatedDate: '2026-09-20', generatedBy: 'System', status: 'DRAFT', mineName: 'WCL-04', fileSize: '2.4 MB' },
    { id: 'r2', name: 'Inspection Summary', type: 'INSPECTION_SUMMARY', period: 'Q3 2026', generatedDate: '2026-09-15', generatedBy: 'Compliance Cell', status: 'APPROVED', mineName: 'SECL-07', fileSize: '5.1 MB' },
    { id: 'r3', name: 'CAPA Status Report', type: 'CAPA_STATUS', period: 'Week 38', generatedDate: '2026-09-19', generatedBy: 'System', status: 'GENERATED', mineName: 'All Mines', fileSize: '1.2 MB' },
    { id: 'r4', name: 'Contractor Compliance Report', type: 'CONTRACTOR_COMPLIANCE', period: 'September 2026', generatedDate: '2026-09-21', generatedBy: 'Audit Team', status: 'GENERATED', mineName: 'WCL-04', fileSize: '1.8 MB' },
    { id: 'r5', name: 'Mine Risk Report', type: 'MINE_RISK', period: 'September 2026', generatedDate: '2026-09-18', generatedBy: 'AI Analysis', status: 'GENERATED', mineName: 'WCL-04', fileSize: '3.1 MB' },
  ]

  const filtered = typeFilter === 'ALL' ? displayReports : displayReports.filter((r) => r.type === typeFilter)

  if (previewMode) {
    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
        <div className="bg-red-dim border border-red/50 text-red-light px-4 py-2 rounded flex items-center justify-center font-mono text-[12px] tracking-widest uppercase font-bold">
          PROTOTYPE / DEMO DATA — Not an official statutory report
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={() => setPreviewMode(false)}
            className="flex items-center gap-1 text-[12px] text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Reports
          </button>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-raised border border-border text-text-secondary text-[12px] font-medium rounded hover:text-text-primary transition-colors">
              <Eye className="w-3.5 h-3.5" /> Generate Report
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber text-mine-black text-[12px] font-medium rounded hover:bg-amber-light transition-colors">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Report Document Wrapper */}
        <div className="bg-white text-black p-8 rounded shadow-2xl min-h-[800px]">
          {/* Header */}
          <div className="border-b-2 border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Monthly Compliance Report</h1>
                <p className="text-gray-600 mt-1 font-mono text-sm">WCL-04 — Wani Opencast Extension</p>
                <p className="text-gray-500 text-sm mt-1">Period: September 2026</p>
              </div>
              <div className="text-right">
                <div className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-700">DRAFT</div>
                <p className="text-xs text-gray-400 mt-2">Generated: 2026-09-20</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Compliance Score</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">72%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Open CAPA</p>
              <p className="text-3xl font-bold text-red-600 mt-1">4</p>
            </div>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Inspections</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">2</p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            
            {/* Risk Findings & Observations */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" /> Risk Findings & Open Observations
              </h2>
              <div className="space-y-4">
                <div className="border border-red-200 bg-red-50 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-red-900 text-sm">Torn ventilation ducting in Panel 3B</h3>
                    <span className="bg-red-200 text-red-800 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">High Risk</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Applicable Obligation</p>
                      <p className="font-mono font-medium text-gray-800 mt-0.5">CMR 2017: Reg 153</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Status / CAPA</p>
                      <p className="font-mono text-amber-700 mt-0.5">CAPA-2026-0042 (Overdue)</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-red-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-700" />
                    <span className="text-xs text-red-800 font-medium">Evidence Attached: KD-E102 (Photo - 94% AI Confidence)</span>
                  </div>
                </div>

                <div className="border border-amber-200 bg-amber-50 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-amber-900 text-sm">Aux fan vibration abnormal</h3>
                    <span className="bg-amber-200 text-amber-800 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Medium Risk</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Applicable Obligation</p>
                      <p className="font-mono font-medium text-gray-800 mt-0.5">CMR 2017: Reg 160</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Status / CAPA</p>
                      <p className="font-mono text-gray-700 mt-0.5">Under Review</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span className="text-xs text-amber-800 font-medium">Evidence Attached: KD-E103 (Video)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Statutory Obligations Status */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gray-700" /> Statutory Obligations Status
              </h2>
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-200 font-semibold text-gray-600">Obligation</th>
                    <th className="p-2 border border-gray-200 font-semibold text-gray-600">Description</th>
                    <th className="p-2 border border-gray-200 font-semibold text-gray-600 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-200 font-mono text-gray-800">CMR Reg 153</td>
                    <td className="p-2 border border-gray-200 text-gray-600">Standard of ventilation</td>
                    <td className="p-2 border border-gray-200 text-center"><span className="text-red-600 font-bold">FAIL</span></td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 font-mono text-gray-800">CMR Reg 158</td>
                    <td className="p-2 border border-gray-200 text-gray-600">Velocity of air current</td>
                    <td className="p-2 border border-gray-200 text-center"><span className="text-red-600 font-bold">FAIL</span></td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 font-mono text-gray-800">CMR Reg 134</td>
                    <td className="p-2 border border-gray-200 text-gray-600">Inspection of workings</td>
                    <td className="p-2 border border-gray-200 text-center"><span className="text-green-600 font-bold">PASS</span></td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Contractor Summary */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                <HardHat className="w-5 h-5 text-gray-700" /> Contractor Summary
              </h2>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded text-sm">
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Sharma Mining Services</strong>: Active at Panel 3B. Received 1 high-risk observation this period related to ventilation maintenance. Registration valid until Dec 2027.
                </p>
                <div className="flex gap-4 border-t border-gray-200 pt-3">
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 uppercase block">Active Personnel</span>
                    <span className="font-bold text-gray-800">45</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 uppercase block">Open CAPAs</span>
                    <span className="font-bold text-red-600">1</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 uppercase block">Compliance Rating</span>
                    <span className="font-bold text-amber-600">78%</span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Header text */}
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold text-text-primary tracking-wide">REPORTS</h1>
        <p className="text-[13px] text-text-muted mt-1">Generate, review and export clause-linked compliance reports.</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-surface-raised border border-border rounded text-[12px] text-text-secondary focus:outline-none"
        >
          <option value="ALL">All Report Types</option>
          {Object.entries(reportTypeLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber text-mine-black text-[12px] font-medium rounded hover:bg-amber-light transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> New Report
        </button>
      </div>

      {/* Reports Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((report) => (
          <div key={report.id} className="bg-surface-raised border border-border rounded-lg overflow-hidden flex flex-col hover:border-border-light transition-colors">
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-mine-black p-2 rounded text-text-muted">
                  <FileCheck className="w-5 h-5" />
                </div>
                <StatusBadge status={report.status} />
              </div>
              <h3 className="text-[14px] font-medium text-text-primary mb-1 leading-snug">{report.name}</h3>
              <p className="text-[12px] font-mono text-amber mb-3">{report.mineName}</p>
              
              <div className="space-y-2 text-[11px] text-text-secondary border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-text-muted uppercase tracking-wider">Period</span>
                  <span className="font-mono">{report.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted uppercase tracking-wider">Generated</span>
                  <span className="font-mono">{formatDate(report.generatedDate)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-mine-black/50 border-t border-border p-3 flex gap-2">
              <button 
                onClick={() => setPreviewMode(true)}
                className="flex-1 px-2 py-1.5 bg-surface-raised border border-border text-text-secondary text-[11px] rounded hover:text-text-primary hover:border-text-muted transition-colors text-center"
              >
                Preview
              </button>
              <button className="flex-1 px-2 py-1.5 bg-surface-raised border border-border text-text-secondary text-[11px] rounded hover:text-text-primary hover:border-text-muted transition-colors flex items-center justify-center gap-1">
                <Download className="w-3 h-3" /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowGenerateModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] bg-surface-raised border border-border rounded-lg shadow-2xl z-50 p-6">
            <h3 className="font-heading text-[18px] font-bold text-text-primary tracking-wide mb-4">GENERATE NEW REPORT</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-text-muted uppercase tracking-wider">Report Type</label>
                <select className="w-full mt-1 px-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary focus:outline-none focus:border-amber/50">
                  {Object.entries(reportTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-text-muted uppercase tracking-wider">Period</label>
                <input
                  type="text"
                  defaultValue="September 2026"
                  className="w-full mt-1 px-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary focus:outline-none focus:border-amber/50"
                />
              </div>
              <div>
                <label className="text-[11px] text-text-muted uppercase tracking-wider">Mine (Optional)</label>
                <select className="w-full mt-1 px-3 py-2 bg-mine-black border border-border rounded text-[13px] text-text-primary focus:outline-none focus:border-amber/50">
                  <option value="">All Mines</option>
                  <option value="mine-wcl-04">WCL-04 — Wani Opencast Extension</option>
                  <option value="mine-secl-07">SECL-07 — Gevra Opencast Project</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setShowGenerateModal(false)} className="px-4 py-2 text-[12px] text-text-secondary hover:text-text-primary transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowGenerateModal(false)
                    setPreviewMode(true)
                  }}
                  className="px-4 py-2 bg-amber text-mine-black text-[12px] font-medium rounded hover:bg-amber-light transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
