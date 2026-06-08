export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'queried'

export interface Claim {
  id: string
  facilityId: string
  facilityName: string
  insurer: string
  patientHieId: string
  diagnosis: string
  procedureCode: string
  amountUGX: number
  submittedAt: string
  status: ClaimStatus
  rejectionReason?: string
  supportingDocuments: string[]
}
