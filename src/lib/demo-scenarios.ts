import type { DiseaseKey } from '@/types/disease'

export interface NurseReportOverrides {
  malariaSuspected: number
  malariaConfirmed: number
  malariaTests: number
  cholera: number
  admissions: number
  opdVisits: number
  referralsOut: number
  actStock: number // days remaining
  rdtStock: number
}

export interface DemoScenario {
  key: string
  label: string
  description: string
  disease: string
  alertDistricts: Record<string, 'critical' | 'high'>
  aiOverride?: string

  // ── Cross-screen connected data ──
  defaultDisease: DiseaseKey
  trendPattern: 'seasonal' | 'spike' | 'stable' | 'declining'
  nurseReportOverrides: NurseReportOverrides
  stockHighlightCommodity: string // commodity highlighted by default
  capacityPressureDistricts: string[] // district IDs under pressure
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    key: 'normal',
    label: 'Normal Surveillance',
    description: 'Baseline national health picture',
    disease: 'malaria',
    alertDistricts: {},
    defaultDisease: 'malaria',
    trendPattern: 'seasonal',
    nurseReportOverrides: {
      malariaSuspected: 8,
      malariaConfirmed: 5,
      malariaTests: 10,
      cholera: 0,
      admissions: 12,
      opdVisits: 47,
      referralsOut: 2,
      actStock: 18,
      rdtStock: 21,
    },
    stockHighlightCommodity: 'ACT (artemether-lumefantrine)',
    capacityPressureDistricts: [],
  },
  {
    key: 'malaria-surge',
    label: '🔴 Malaria Surge — North',
    description: 'Active outbreak in northern refugee-hosting districts',
    disease: 'malaria',
    alertDistricts: {
      arua: 'critical',
      yumbe: 'critical',
      adjumani: 'critical',
      moyo: 'high',
      gulu: 'high',
      kitgum: 'high',
      lira: 'high',
    },
    aiOverride:
      'URGENT: Malaria cases in Arua and Yumbe have exceeded the critical threshold, recording 2.3× and 2.8× above district baselines respectively. The surge is consistent with seasonal peak patterns amplified by high population density in refugee settlements. Adjumani district has also crossed the critical threshold. Immediate ACT and RDT pre-positioning is recommended for Arua RRH, Yumbe Hospital, and Adjumani HCIV. District Health Officers in all three districts should be alerted within the hour.',
    defaultDisease: 'malaria',
    trendPattern: 'spike',
    nurseReportOverrides: {
      malariaSuspected: 31,
      malariaConfirmed: 24,
      malariaTests: 34,
      cholera: 0,
      admissions: 28,
      opdVisits: 89,
      referralsOut: 7,
      actStock: 4,
      rdtStock: 6,
    },
    stockHighlightCommodity: 'ACT (artemether-lumefantrine)',
    capacityPressureDistricts: ['gulu', 'arua', 'lira', 'kitgum'],
  },
  {
    key: 'cholera-alert',
    label: '🟠 Cholera Alert — Lakeside',
    description: 'Cluster detected near Lake Victoria landing sites',
    disease: 'cholera',
    alertDistricts: {
      tororo: 'critical',
      busia: 'critical',
      mayuge: 'high',
      jinja: 'high',
      iganga: 'high',
    },
    aiOverride:
      'ALERT: A cholera cluster has been detected in Tororo and Busia districts consistent with contaminated water sources at Lake Victoria landing sites. Case investigation is ongoing. Oral rehydration salts and IV fluids are at watch-level stock in both districts. WASH emergency response activation is recommended. Jinja, Mayuge, and Iganga are classified as high-risk due to proximity and shared water sources. Population advisories should be issued immediately.',
    defaultDisease: 'cholera',
    trendPattern: 'spike',
    nurseReportOverrides: {
      malariaSuspected: 6,
      malariaConfirmed: 4,
      malariaTests: 8,
      cholera: 3,
      admissions: 19,
      opdVisits: 61,
      referralsOut: 5,
      actStock: 14,
      rdtStock: 17,
    },
    stockHighlightCommodity: 'ORS / Zinc',
    capacityPressureDistricts: ['tororo', 'busia', 'jinja'],
  },
  {
    key: 'stock-crisis',
    label: '📦 ACT Stock Crisis',
    description: 'Critical ACT shortage across 12 northern facilities',
    disease: 'malaria',
    alertDistricts: {
      kaabong: 'critical',
      kotido: 'critical',
      moroto: 'critical',
      arua: 'high',
      gulu: 'high',
      lira: 'high',
      kitgum: 'high',
      pader: 'high',
    },
    aiOverride:
      'CRITICAL STOCK ALERT: Artemether-Lumefantrine (ACT) stocks have fallen below the 7-day critical threshold at 12 facilities across northern Uganda. Kaabong, Kotido, and Moroto districts are at immediate stock-out risk. Given current malaria case loads, facilities in these districts will exhaust ACT supply within 4 days without emergency resupply. National Medical Stores emergency order recommended immediately. Interim: redistribute surplus ACT stock from Kampala and Wakiso facilities to cover the north.',
    defaultDisease: 'malaria',
    trendPattern: 'seasonal',
    nurseReportOverrides: {
      malariaSuspected: 14,
      malariaConfirmed: 9,
      malariaTests: 16,
      cholera: 0,
      admissions: 18,
      opdVisits: 52,
      referralsOut: 3,
      actStock: 2,
      rdtStock: 3,
    },
    stockHighlightCommodity: 'ACT (artemether-lumefantrine)',
    capacityPressureDistricts: ['kaabong', 'kotido', 'moroto'],
  },
]

export const DEFAULT_SCENARIO = DEMO_SCENARIOS[0]
