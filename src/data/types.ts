// ============================================================
// Khanan Drishti — Core Type Definitions
// ============================================================

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW'
export type CAPAStatus = 'OPEN' | 'IN_PROGRESS' | 'OVERDUE' | 'CLOSED'
export type InspectionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING_REVIEW'
export type EvidenceType = 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'SENSOR_DATA' | 'AUDIO'
export type ObservationType = 'SAFETY' | 'ENVIRONMENTAL' | 'STRUCTURAL' | 'ELECTRICAL' | 'VENTILATION' | 'BLASTING'
export type MineType = 'OPENCAST' | 'UNDERGROUND' | 'MIXED'
export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'UNDER_REVIEW'

export interface Mine {
  id: string
  code: string
  name: string
  subsidiary: string
  subsidiaryCode: string
  type: MineType
  location: string
  state: string
  district: string
  coordinates: [number, number] // [lng, lat]
  status: 'ACTIVE' | 'SUSPENDED' | 'UNDER_MAINTENANCE'
  complianceScore: number
  riskLevel: RiskLevel
  lastInspectionDate: string
  totalWorkers: number
  annualProductionMT: number
  area: string
}

export interface Inspection {
  id: string
  mineId: string
  mineName: string
  mineCode: string
  date: string
  inspector: string
  inspectorDesignation: string
  type: 'ROUTINE' | 'SPECIAL' | 'FOLLOW_UP' | 'DGMS_DIRECTED'
  status: InspectionStatus
  observationsCount: number
  highRiskCount: number
  findings: string
  riskLevel: RiskLevel
}

export interface Observation {
  id: string
  inspectionId: string
  mineId: string
  mineName: string
  type: ObservationType
  title: string
  description: string
  riskLevel: RiskLevel
  status: 'OPEN' | 'UNDER_REVIEW' | 'CAPA_ASSIGNED' | 'RESOLVED'
  regulationRef: string
  regulationClause: string
  dateIdentified: string
  evidenceIds: string[]
  capaId?: string
  aiVerified: boolean
  aiConfidence?: number
}

export interface CAPA {
  id: string
  observationId: string
  mineId: string
  mineName: string
  title: string
  description: string
  status: CAPAStatus
  priority: RiskLevel
  assignedContractor: string
  contractorId: string
  createdDate: string
  dueDate: string
  completedDate?: string
  slaHours: number
  progressPercent: number
  actions: string[]
}

export interface Contractor {
  id: string
  name: string
  specialization: string
  contactPerson: string
  phone: string
  email: string
  activeCAPAs: number
  completedCAPAs: number
  complianceRating: number
  registrationNo: string
  validTill: string
  status: 'ACTIVE' | 'SUSPENDED' | 'BLACKLISTED'
}

export interface ComplianceObligation {
  id: string
  regulationName: string
  section: string
  clause: string
  description: string
  category: string
  applicableTo: MineType[]
  status: ComplianceStatus
  dueDate?: string
  lastAuditDate?: string
  responsibleRole: string
  riskIfNonCompliant: RiskLevel
}

export interface Evidence {
  id: string
  inspectionId: string
  observationId: string
  mineId: string
  mineName: string
  type: EvidenceType
  fileName: string
  capturedBy: string
  capturedDate: string
  geoTag: string
  aiAnalysisStatus: 'PENDING' | 'ANALYZED' | 'FLAGGED' | 'VERIFIED'
  aiFindings?: string
  tags: string[]
}

export interface AIInsight {
  id: string
  title: string
  description: string
  category: 'SAFETY' | 'COMPLIANCE' | 'ENVIRONMENTAL' | 'PREDICTIVE' | 'OPERATIONAL'
  confidence: number
  explanation: string
  evidenceRef: string
  evidenceId?: string
  regulationRef?: string
  regulationClause?: string
  severity: RiskLevel
  mineId: string
  mineName: string
  createdDate: string
  status: 'NEW' | 'ACKNOWLEDGED' | 'ACTED_UPON' | 'DISMISSED'
  recommendedAction: string
}

export interface RiskAlert {
  id: string
  title: string
  description: string
  mineId: string
  mineName: string
  severity: RiskLevel
  category: string
  timestamp: string
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'
  source: 'AI' | 'INSPECTION' | 'SENSOR' | 'MANUAL'
}

export interface Report {
  id: string
  name: string
  type: 'COMPLIANCE' | 'RISK_ASSESSMENT' | 'INSPECTION_SUMMARY' | 'CAPA_STATUS' | 'MONTHLY_REVIEW' | 'DGMS_RETURN'
  generatedDate: string
  period: string
  status: 'DRAFT' | 'GENERATED' | 'SUBMITTED' | 'APPROVED'
  generatedBy: string
  mineId?: string
  mineName?: string
  fileSize: string
}

export interface ActivityItem {
  id: string
  type: 'INSPECTION' | 'OBSERVATION' | 'CAPA' | 'ALERT' | 'AI_INSIGHT' | 'REPORT'
  title: string
  description: string
  timestamp: string
  mineId: string
  mineName: string
  severity?: RiskLevel
}
