import raw from './seed/district_disease_weekly.json'
import { SEED_TO_OUR_ID } from '@/lib/seed-mapping'

export interface WeeklyDiseaseRecord {
  weekStart: string
  districtId: string // mapped to OUR district id
  diseaseName: string
  casesLast7d: number
  casesPrevious7d: number
  weekOnWeekChangePct: number
  incidencePer100k: number
  deathsLast7d: number
  severity: string
}

interface RawWeekly {
  week_start: string
  district_id: string
  disease_name: string
  cases_last_7d: number
  cases_previous_7d: number
  week_on_week_change_pct: number
  incidence_per_100k: number
  deaths_last_7d: number
  severity: string
}

export const WEEKLY_DISEASE_DATA: WeeklyDiseaseRecord[] = (raw as unknown as RawWeekly[])
  .map((r): WeeklyDiseaseRecord | null => {
    const ourId = SEED_TO_OUR_ID[r.district_id]
    if (!ourId) return null // skip unmatched districts
    return {
      weekStart: r.week_start,
      districtId: ourId,
      diseaseName: r.disease_name,
      casesLast7d: r.cases_last_7d,
      casesPrevious7d: r.cases_previous_7d,
      weekOnWeekChangePct: r.week_on_week_change_pct,
      incidencePer100k: r.incidence_per_100k,
      deathsLast7d: r.deaths_last_7d,
      severity: r.severity,
    }
  })
  .filter((r): r is WeeklyDiseaseRecord => r !== null)

const matchesDisease = (name: string, query: string) =>
  name.toLowerCase().includes(query.toLowerCase())

/** Records for a district + disease, sorted by week ascending. */
export function getWeeklyTrend(
  districtId: string,
  disease: string
): WeeklyDiseaseRecord[] {
  return WEEKLY_DISEASE_DATA.filter(
    (r) => r.districtId === districtId && matchesDisease(r.diseaseName, disease)
  ).sort((a, b) => a.weekStart.localeCompare(b.weekStart))
}

/**
 * National aggregate per week for a disease (loose, case-insensitive match),
 * sorted by week ascending, last 8 weeks only.
 */
export function getNationalWeeklyTrend(
  disease: string
): Array<{ week: string; cases: number; deaths: number }> {
  const byWeek = new Map<string, { cases: number; deaths: number }>()
  for (const r of WEEKLY_DISEASE_DATA) {
    if (!matchesDisease(r.diseaseName, disease)) continue
    const e = byWeek.get(r.weekStart) ?? { cases: 0, deaths: 0 }
    e.cases += r.casesLast7d
    e.deaths += r.deathsLast7d
    byWeek.set(r.weekStart, e)
  }
  return [...byWeek.entries()]
    .map(([week, v]) => ({ week, ...v }))
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-8)
}

/** Most recent week record for a district + disease, or null. */
export function getDistrictLatestWeek(
  districtId: string,
  disease: string
): WeeklyDiseaseRecord | null {
  const rows = getWeeklyTrend(districtId, disease)
  return rows.length ? rows[rows.length - 1] : null
}
