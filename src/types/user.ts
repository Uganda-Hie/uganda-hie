export type DemoRole =
  | 'moh-analyst'
  | 'facility-nurse'
  | 'doctor'
  | 'patient'
  | 'insurer'
  | 'admin'

export interface DemoUser {
  role: DemoRole
  name: string
  facility?: string
  district?: string
  label: string
  description: string
  color: string
}

export const DEMO_USERS: DemoUser[] = [
  { role: 'moh-analyst',    name: 'Dr. Nakato Amina',    label: 'MoH Analyst',       description: 'National disease surveillance & command center', color: 'bg-blue-600' },
  { role: 'facility-nurse', name: 'Nurse Okello Brian',  label: 'Facility Nurse',     description: 'Remote HCIII — Karenga, Kaabong District',       color: 'bg-green-600', facility: 'Karenga HCIII', district: 'kaabong' },
  { role: 'doctor',         name: 'Dr. Ssemakula Paul',  label: 'Clinical Officer',   description: 'Gulu Regional Referral Hospital',                color: 'bg-purple-600', facility: 'Gulu RRH', district: 'gulu' },
  { role: 'patient',        name: 'Aciro Grace',         label: 'Patient',            description: 'Patient portal — health record & sharing',       color: 'bg-orange-500' },
  { role: 'insurer',        name: 'Mukasa David',        label: 'Insurance Officer',  description: 'UAP Uganda — Claims verification portal',        color: 'bg-teal-600' },
  { role: 'admin',          name: 'Nalwoga Josephine',   label: 'System Admin / DPO', description: 'Audit logs & access review',                     color: 'bg-slate-600' },
]
