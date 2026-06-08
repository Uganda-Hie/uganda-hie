import { DailyReport } from '@/types/report'

// ── Seeded pseudo-random (deterministic — stable across renders/SSR) ───────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

// 8 reporting facilities with a regional malaria bias.
// Northern (Gulu/Arua/Lira) carry the heaviest malaria burden;
// Central/Western (Mulago/Mbarara/Entebbe) the lightest.
const REPORTING_FACILITIES: Array<{
  facilityId: string
  malariaBias: number
  reporter: string
  role: string
}> = [
  { facilityId: 'f001', malariaBias: 1.9, reporter: 'Okello Brian',     role: 'Records Officer' },     // Gulu RRH
  { facilityId: 'f004', malariaBias: 1.7, reporter: 'Andama Joyce',     role: 'Records Officer' },     // Arua RRH
  { facilityId: 'f012', malariaBias: 1.6, reporter: 'Engola Peter',     role: 'Nurse' },               // Lira RRH
  { facilityId: 'f016', malariaBias: 1.3, reporter: 'Wanyama Sarah',    role: 'Records Officer' },     // Mbale RRH
  { facilityId: 'f018', malariaBias: 1.1, reporter: 'Babirye Allen',    role: 'Clinical Officer' },    // Jinja RRH
  { facilityId: 'f028', malariaBias: 0.7, reporter: 'Nakimuli Esther',  role: 'Records Officer' },     // Mulago NRH
  { facilityId: 'f024', malariaBias: 0.6, reporter: 'Tumusiime Alex',   role: 'Records Officer' },     // Mbarara RRH
  { facilityId: 'f032', malariaBias: 0.8, reporter: 'Ssali Henry',      role: 'Nurse' },               // Entebbe Hospital
]

const STOCK_KEYS = ['acts', 'rdts', 'amoxicillin', 'ors-zinc', 'oxytocin', 'arvs', 'oxygen']

const NARRATIVES = [
  '',
  '',
  'Stable day, no major incidents.',
  'OPD higher than usual — suspected malaria cluster in catchment village.',
  'ACTs running low, requested resupply from district store.',
  'Referral ambulance out of fuel for part of the shift.',
  'Two maternal admissions referred to higher level overnight.',
]

// 20 reports distributed across the 8 facilities over the last 14 days
// (relative to demo date 2026-06-08). Dates hardcoded to keep SSR stable.
const REPORT_PLAN: Array<{ facilityIndex: number; reportDate: string }> = [
  { facilityIndex: 0, reportDate: '2026-06-07' },
  { facilityIndex: 0, reportDate: '2026-06-04' },
  { facilityIndex: 0, reportDate: '2026-05-30' },
  { facilityIndex: 1, reportDate: '2026-06-07' },
  { facilityIndex: 1, reportDate: '2026-06-02' },
  { facilityIndex: 1, reportDate: '2026-05-28' },
  { facilityIndex: 2, reportDate: '2026-06-06' },
  { facilityIndex: 2, reportDate: '2026-06-01' },
  { facilityIndex: 3, reportDate: '2026-06-07' },
  { facilityIndex: 3, reportDate: '2026-06-03' },
  { facilityIndex: 3, reportDate: '2026-05-27' },
  { facilityIndex: 4, reportDate: '2026-06-05' },
  { facilityIndex: 4, reportDate: '2026-05-31' },
  { facilityIndex: 5, reportDate: '2026-06-07' },
  { facilityIndex: 5, reportDate: '2026-06-04' },
  { facilityIndex: 5, reportDate: '2026-05-29' },
  { facilityIndex: 6, reportDate: '2026-06-06' },
  { facilityIndex: 6, reportDate: '2026-05-30' },
  { facilityIndex: 7, reportDate: '2026-06-05' },
  { facilityIndex: 7, reportDate: '2026-05-26' },
]

function buildReports(): DailyReport[] {
  return REPORT_PLAN.map((plan, i) => {
    const fac = REPORTING_FACILITIES[plan.facilityIndex]
    const rand = seededRandom((charSum(fac.facilityId) + i * 131) * 17 + 5)

    const opdVisits = Math.round(60 + rand() * 180)
    const emergencyVisits = Math.round(rand() * 25)
    const admissions = Math.round(8 + rand() * 30)
    const discharges = Math.round(6 + rand() * 28)
    const referralsOut = Math.round(rand() * 8)
    const referralsIn = Math.round(rand() * 6)

    const malariaSuspected = Math.round((20 + rand() * 90) * fac.malariaBias)
    const malariaTests = Math.round(malariaSuspected * (0.7 + rand() * 0.3))
    const malariaConfirmed = Math.round(malariaTests * (0.35 + rand() * 0.4))

    const cholera = rand() > 0.85 ? Math.round(rand() * 6) : 0
    const measles = rand() > 0.8 ? Math.round(rand() * 4) : 0
    const tb = Math.round(rand() * 5)
    const respiratory = Math.round(10 + rand() * 50)
    const diarrhoeal = Math.round(5 + rand() * 40)
    const maternalSepsis = rand() > 0.85 ? Math.round(rand() * 3) : 0

    const births = Math.round(2 + rand() * 12)
    const stillbirths = rand() > 0.8 ? Math.round(rand() * 2) : 0
    const neonatalDeaths = rand() > 0.85 ? Math.round(rand() * 2) : 0
    const under5Deaths = rand() > 0.8 ? Math.round(rand() * 2) : 0
    const maternalDeaths = rand() > 0.95 ? 1 : 0
    const adultDeaths = Math.round(rand() * 4)

    const totalBeds = Math.round(80 + rand() * 320)
    const occupiedBeds = Math.round(totalBeds * (0.45 + rand() * 0.5))

    const stock: Record<string, number> = {}
    for (const key of STOCK_KEYS) {
      stock[key] = Math.round(rand() * 600)
    }

    const status: DailyReport['status'] = rand() > 0.45 ? 'validated' : 'submitted'
    const narrativeEvent = NARRATIVES[Math.floor(rand() * NARRATIVES.length)]

    return {
      id: `RPT-${plan.reportDate.replace(/-/g, '')}-${fac.facilityId}`,
      facilityId: fac.facilityId,
      reportDate: plan.reportDate,
      submittedAt: `${plan.reportDate}T18:${String(10 + (i % 49)).padStart(2, '0')}:00Z`,
      reporterName: fac.reporter,
      reporterRole: fac.role,
      status,
      opdVisits,
      emergencyVisits,
      admissions,
      discharges,
      referralsOut,
      referralsIn,
      malariaSuspected,
      malariaConfirmed,
      malariaTests,
      cholera,
      measles,
      tb,
      respiratory,
      diarrhoeal,
      maternalSepsis,
      births,
      stillbirths,
      neonatalDeaths,
      under5Deaths,
      maternalDeaths,
      adultDeaths,
      totalBeds,
      occupiedBeds: Math.min(occupiedBeds, totalBeds),
      oxygenAvailable: rand() > 0.2,
      ambulanceOperational: rand() > 0.25,
      stock,
      narrativeEvent,
    }
  })
}

function charSum(str: string): number {
  return [...str].reduce((sum, c) => sum + c.charCodeAt(0), 0)
}

export const DAILY_REPORTS: DailyReport[] = buildReports()

export function getReportsByFacility(facilityId: string): DailyReport[] {
  return DAILY_REPORTS.filter((r) => r.facilityId === facilityId)
}

export function getLatestReport(facilityId: string): DailyReport | undefined {
  return getReportsByFacility(facilityId)
    .slice()
    .sort((a, b) => b.reportDate.localeCompare(a.reportDate))[0]
}
