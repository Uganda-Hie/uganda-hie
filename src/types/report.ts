export interface DailyReport {
  id: string
  facilityId: string
  reportDate: string
  submittedAt: string
  reporterName: string
  reporterRole: string
  status: 'draft' | 'submitted' | 'validated'
  opdVisits: number
  emergencyVisits: number
  admissions: number
  discharges: number
  referralsOut: number
  referralsIn: number
  malariaSuspected: number
  malariaConfirmed: number
  malariaTests: number
  cholera: number
  measles: number
  tb: number
  respiratory: number
  diarrhoeal: number
  maternalSepsis: number
  births: number
  stillbirths: number
  neonatalDeaths: number
  under5Deaths: number
  maternalDeaths: number
  adultDeaths: number
  totalBeds: number
  occupiedBeds: number
  oxygenAvailable: boolean
  ambulanceOperational: boolean
  stock: Record<string, number>
  narrativeEvent: string
}
