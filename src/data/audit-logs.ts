export type AuditAction = 'view' | 'emergency-access' | 'share' | 'revoke' | 'download'

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: string
  patientHieId: string
  action: AuditAction
  facilityId: string
  timestamp: string
  reason: string
  flagged: boolean
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'AUD-0001', userId: 'u-doc-01', userName: 'Dr. Ssemakula Paul', userRole: 'Clinical Officer', patientHieId: 'HIE-2024-00142', action: 'view',     facilityId: 'f001', timestamp: '2026-06-07T08:12:00Z', reason: 'Routine consultation — OPD review', flagged: false },
  { id: 'AUD-0002', userId: 'u-doc-01', userName: 'Dr. Ssemakula Paul', userRole: 'Clinical Officer', patientHieId: 'HIE-2024-00142', action: 'download', facilityId: 'f001', timestamp: '2026-06-07T08:15:00Z', reason: 'Printed lab results for patient file', flagged: false },
  { id: 'AUD-0003', userId: 'u-nur-02', userName: 'Nurse Okello Brian', userRole: 'Facility Nurse',   patientHieId: 'HIE-2024-00703', action: 'view',     facilityId: 'f011', timestamp: '2026-06-07T09:40:00Z', reason: 'Nutrition follow-up check', flagged: false },
  { id: 'AUD-0004', userId: 'u-doc-03', userName: 'Dr. Among Rebecca',  userRole: 'Medical Officer',   patientHieId: 'HIE-2024-00389', action: 'view',     facilityId: 'f028', timestamp: '2026-06-06T14:05:00Z', reason: 'TB treatment monitoring visit', flagged: false },
  { id: 'AUD-0005', userId: 'u-doc-03', userName: 'Dr. Among Rebecca',  userRole: 'Medical Officer',   patientHieId: 'HIE-2024-00389', action: 'share',    facilityId: 'f028', timestamp: '2026-06-06T14:20:00Z', reason: 'Shared record with TB clinic for co-management', flagged: false },
  { id: 'AUD-0006', userId: 'u-emt-01', userName: 'Dr. Kato Emmanuel',  userRole: 'Emergency Physician', patientHieId: 'HIE-2024-00517', action: 'emergency-access', facilityId: 'f028', timestamp: '2026-06-04T23:48:00Z', reason: 'Road accident — unconscious patient, next of kin unreachable', flagged: false },
  { id: 'AUD-0007', userId: 'u-emt-01', userName: 'Dr. Kato Emmanuel',  userRole: 'Emergency Physician', patientHieId: 'HIE-2024-00517', action: 'view',     facilityId: 'f028', timestamp: '2026-06-04T23:49:00Z', reason: 'Reviewing allergies and current medications pre-surgery', flagged: false },
  { id: 'AUD-0008', userId: 'u-pat-01', userName: 'Aciro Grace',        userRole: 'Patient',           patientHieId: 'HIE-2024-00142', action: 'view',     facilityId: 'f001', timestamp: '2026-06-05T10:02:00Z', reason: 'Patient portal — viewed own record', flagged: false },
  { id: 'AUD-0009', userId: 'u-pat-01', userName: 'Aciro Grace',        userRole: 'Patient',           patientHieId: 'HIE-2024-00142', action: 'share',    facilityId: 'f001', timestamp: '2026-06-05T10:05:00Z', reason: 'Granted access to Lacor Hospital for referral', flagged: false },
  { id: 'AUD-0010', userId: 'u-ins-01', userName: 'Mukasa David',       userRole: 'Insurance Officer', patientHieId: 'HIE-2024-00891', action: 'view',     facilityId: 'f024', timestamp: '2026-06-05T11:30:00Z', reason: 'Claim verification CLM-2026-0004', flagged: false },
  { id: 'AUD-0011', userId: 'u-ins-01', userName: 'Mukasa David',       userRole: 'Insurance Officer', patientHieId: 'HIE-2024-00389', action: 'view',     facilityId: 'f028', timestamp: '2026-06-04T16:10:00Z', reason: 'Claim verification CLM-2026-0002', flagged: false },
  { id: 'AUD-0012', userId: 'u-doc-04', userName: 'Dr. Nabukenya Lydia', userRole: 'Obstetrician',     patientHieId: 'HIE-2024-00517', action: 'view',     facilityId: 'f032', timestamp: '2026-06-03T09:25:00Z', reason: 'Antenatal review — pre-eclampsia monitoring', flagged: false },
  { id: 'AUD-0013', userId: 'u-doc-04', userName: 'Dr. Nabukenya Lydia', userRole: 'Obstetrician',     patientHieId: 'HIE-2024-00517', action: 'download', facilityId: 'f032', timestamp: '2026-06-03T09:31:00Z', reason: 'Downloaded ultrasound report', flagged: false },
  { id: 'AUD-0014', userId: 'u-emt-02', userName: 'Dr. Opio Samuel',    userRole: 'Emergency Physician', patientHieId: 'HIE-2024-00703', action: 'emergency-access', facilityId: 'f004', timestamp: '2026-06-02T02:14:00Z', reason: 'Paediatric emergency — convulsions, guardian absent', flagged: false },
  { id: 'AUD-0015', userId: 'u-doc-05', userName: 'Dr. Akello Brenda',  userRole: 'Medical Officer',   patientHieId: 'HIE-2024-00891', action: 'view',     facilityId: 'f024', timestamp: '2026-06-02T13:40:00Z', reason: 'ART refill review', flagged: false },
  { id: 'AUD-0016', userId: 'u-doc-01', userName: 'Dr. Ssemakula Paul', userRole: 'Clinical Officer',  patientHieId: 'HIE-2024-00142', action: 'view',     facilityId: 'f001', timestamp: '2026-06-01T15:55:00Z', reason: 'Follow-up — anaemia recheck', flagged: false },
  { id: 'AUD-0017', userId: 'u-adm-01', userName: 'Nalwoga Josephine',  userRole: 'System Admin / DPO', patientHieId: 'HIE-2024-00389', action: 'view',     facilityId: 'f028', timestamp: '2026-06-01T08:00:00Z', reason: 'Access audit — periodic compliance review', flagged: false },
  { id: 'AUD-0018', userId: 'u-doc-06', userName: 'Dr. Wasswa Ronald',  userRole: 'Medical Officer',   patientHieId: 'HIE-2024-00891', action: 'view',     facilityId: 'f016', timestamp: '2026-05-31T21:18:00Z', reason: 'No active care episode at this facility', flagged: true },
  { id: 'AUD-0019', userId: 'u-doc-06', userName: 'Dr. Wasswa Ronald',  userRole: 'Medical Officer',   patientHieId: 'HIE-2024-00891', action: 'download', facilityId: 'f016', timestamp: '2026-05-31T21:22:00Z', reason: 'Bulk download of full clinical history — unusual volume', flagged: true },
  { id: 'AUD-0020', userId: 'u-emt-01', userName: 'Dr. Kato Emmanuel',  userRole: 'Emergency Physician', patientHieId: 'HIE-2024-00389', action: 'emergency-access', facilityId: 'f028', timestamp: '2026-05-30T03:05:00Z', reason: 'Collapse in casualty — diabetic emergency, history needed urgently', flagged: false },
  { id: 'AUD-0021', userId: 'u-doc-05', userName: 'Dr. Akello Brenda',  userRole: 'Medical Officer',   patientHieId: 'HIE-2024-00891', action: 'revoke',   facilityId: 'f024', timestamp: '2026-05-30T12:00:00Z', reason: 'Patient revoked external clinic access', flagged: false },
  { id: 'AUD-0022', userId: 'u-pat-02', userName: 'Ssemakula Robert',   userRole: 'Patient',           patientHieId: 'HIE-2024-00389', action: 'view',     facilityId: 'f028', timestamp: '2026-05-29T19:44:00Z', reason: 'Patient portal — viewed own record', flagged: false },
  { id: 'AUD-0023', userId: 'u-nur-02', userName: 'Nurse Okello Brian', userRole: 'Facility Nurse',    patientHieId: 'HIE-2024-00703', action: 'share',    facilityId: 'f011', timestamp: '2026-05-28T10:30:00Z', reason: 'Referred to Arua RRH — shared nutrition records', flagged: false },
  { id: 'AUD-0024', userId: 'u-ins-01', userName: 'Mukasa David',       userRole: 'Insurance Officer', patientHieId: 'HIE-2024-00142', action: 'view',     facilityId: 'f001', timestamp: '2026-05-27T11:15:00Z', reason: 'Claim verification CLM-2026-0001', flagged: false },
  { id: 'AUD-0025', userId: 'u-doc-04', userName: 'Dr. Nabukenya Lydia', userRole: 'Obstetrician',     patientHieId: 'HIE-2024-00517', action: 'view',     facilityId: 'f032', timestamp: '2026-05-26T08:50:00Z', reason: 'Routine antenatal visit', flagged: false },
]

export function getFlaggedLogs(): AuditLog[] {
  return AUDIT_LOGS.filter((l) => l.flagged)
}

export function getLogsByPatient(hieId: string): AuditLog[] {
  return AUDIT_LOGS.filter((l) => l.patientHieId === hieId)
}
