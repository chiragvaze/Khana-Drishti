import { useState } from 'react'
import { HardHat, Star, AlertTriangle, Phone, Mail } from 'lucide-react'
import { StatusBadge } from '../components/shared/StatusBadge'
import { KPICard } from '../components/shared/KPICard'
import { contractors } from '../data/contractors'
import { cn, formatDate } from '../lib/utils'

export default function Contractors() {
  const [selectedContractor, setSelectedContractor] = useState<string | null>(null)

  const activeCount = contractors.filter((c) => c.status === 'ACTIVE').length
  const totalActiveCAPAs = contractors.reduce((sum, c) => sum + c.activeCAPAs, 0)
  const avgRating = Math.round(contractors.reduce((sum, c) => sum + c.complianceRating, 0) / contractors.length)

  const selected = contractors.find((c) => c.id === selectedContractor)

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Contractors" value={contractors.length} icon={<HardHat className="w-4 h-4" />} />
        <KPICard label="Active" value={activeCount} variant="success" />
        <KPICard label="Active CAPAs Assigned" value={totalActiveCAPAs} />
        <KPICard label="Avg. Compliance Rating" value={`${avgRating}%`} variant={avgRating >= 80 ? 'success' : 'warning'} />
      </div>

      {/* Table */}
      <div className="flex gap-4">
        <div className={`bg-surface-raised border border-border rounded overflow-hidden ${selected ? 'flex-1' : 'w-full'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-mine-black/50">
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Contractor</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Specialization</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Active CAPAs</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Completed</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contractors.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedContractor(selectedContractor === c.id ? null : c.id)}
                    className={cn(
                      'cursor-pointer transition-colors',
                      selectedContractor === c.id ? 'bg-amber-dim' : 'hover:bg-mine-black/50'
                    )}
                  >
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-medium text-text-primary">{c.name}</p>
                      <p className="text-[11px] text-text-muted">{c.contactPerson}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary">{c.specialization}</td>
                    <td className="px-4 py-3 text-[12px] font-mono text-text-primary">
                      {c.activeCAPAs > 0 ? (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber" />
                          {c.activeCAPAs}
                        </span>
                      ) : '0'}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-mono text-text-secondary">{c.completedCAPAs}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-mine-black rounded overflow-hidden">
                          <div
                            className={`h-full rounded ${c.complianceRating >= 80 ? 'bg-green' : c.complianceRating >= 60 ? 'bg-amber' : 'bg-red'}`}
                            style={{ width: `${c.complianceRating}%` }}
                          />
                        </div>
                        <span className="text-[12px] font-mono text-text-primary">{c.complianceRating}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="w-[340px] flex-shrink-0 bg-surface-raised border border-border rounded p-5 self-start sticky top-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-[15px] font-bold text-text-primary tracking-wide">CONTRACTOR</h3>
              <button onClick={() => setSelectedContractor(null)} className="text-text-muted hover:text-text-secondary text-[12px]">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[14px] font-medium text-text-primary">{selected.name}</p>
                <p className="text-[12px] text-text-secondary mt-0.5">{selected.specialization}</p>
              </div>
              <div className="flex items-center gap-1 text-amber">
                <Star className="w-4 h-4" />
                <span className="font-mono text-[14px] font-bold">{selected.complianceRating}%</span>
                <span className="text-[11px] text-text-muted ml-1">compliance rating</span>
              </div>
              <div className="pt-3 border-t border-border space-y-2">
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Contact</p>
                <p className="text-[12px] text-text-primary">{selected.contactPerson}</p>
                <div className="flex items-center gap-1.5 text-text-secondary text-[12px]">
                  <Phone className="w-3.5 h-3.5" /> {selected.phone}
                </div>
                <div className="flex items-center gap-1.5 text-text-secondary text-[12px]">
                  <Mail className="w-3.5 h-3.5" /> {selected.email}
                </div>
              </div>
              <div className="pt-3 border-t border-border space-y-2">
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Registration</p>
                <p className="text-[12px] font-mono text-text-primary">{selected.registrationNo}</p>
                <p className="text-[11px] text-text-muted">Valid till: {formatDate(selected.validTill)}</p>
              </div>
              <div className="pt-3 border-t border-border grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Active CAPAs</p>
                  <p className="font-mono text-[16px] font-bold text-text-primary">{selected.activeCAPAs}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Completed</p>
                  <p className="font-mono text-[16px] font-bold text-green">{selected.completedCAPAs}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
