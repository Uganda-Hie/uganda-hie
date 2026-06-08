import raw from './seed/district_monthly_summary.json'
import { SEED_TO_OUR_ID } from '@/lib/seed-mapping'

export interface DistrictMonthlySummary {
  districtId: string // mapped to OUR district id
  districtName: string
  population: number
  births30d: number
  allCauseDeaths30d: number
  under5Deaths30d: number
  maternalDeaths30d: number
  dpt3CoveragePct: number
  measles1CoveragePct: number
  reportingCompletenessPct: number
  reportingTimelinessPct: number
  avgBedOccupancyPct: number
  facilitiesWithStockout: number
  referralsOut30d: number
  claimsSubmitted30d: number
}

interface RawMonthly {
  month: string
  district_id: string
  district_name: string
  population_2026_est: number
  births_30d: number
  all_cause_deaths_30d: number
  under5_deaths_30d: number
  maternal_deaths_30d: number
  dpt3_coverage_pct: number
  measles1_coverage_pct: number
  reporting_completeness_pct: number
  reporting_timeliness_pct: number
  avg_bed_occupancy_pct: number
  facilities_with_stockout_count: number
  referrals_out_30d: number
  claims_submitted_30d: number
}

export const DISTRICT_MONTHLY: DistrictMonthlySummary[] = (raw as unknown as RawMonthly[])
  .map((r): DistrictMonthlySummary | null => {
    const ourId = SEED_TO_OUR_ID[r.district_id]
    if (!ourId) return null
    return {
      districtId: ourId,
      districtName: r.district_name,
      population: r.population_2026_est,
      births30d: r.births_30d,
      allCauseDeaths30d: r.all_cause_deaths_30d,
      under5Deaths30d: r.under5_deaths_30d,
      maternalDeaths30d: r.maternal_deaths_30d,
      dpt3CoveragePct: r.dpt3_coverage_pct,
      measles1CoveragePct: r.measles1_coverage_pct,
      reportingCompletenessPct: r.reporting_completeness_pct,
      reportingTimelinessPct: r.reporting_timeliness_pct,
      avgBedOccupancyPct: r.avg_bed_occupancy_pct,
      facilitiesWithStockout: r.facilities_with_stockout_count,
      referralsOut30d: r.referrals_out_30d,
      claimsSubmitted30d: r.claims_submitted_30d,
    }
  })
  .filter((r): r is DistrictMonthlySummary => r !== null)

export function getMonthlySummary(districtId: string): DistrictMonthlySummary | null {
  return DISTRICT_MONTHLY.find((d) => d.districtId === districtId) ?? null
}

export interface NationalMonthlyKPIs {
  totalBirths30d: number
  totalAllCauseDeaths30d: number
  totalMaternalDeaths30d: number
  totalUnder5Deaths30d: number
  avgReportingCompleteness: number
  avgReportingTimeliness: number
  avgBedOccupancy: number
  avgDpt3Coverage: number
  avgMeasles1Coverage: number
  totalFacilitiesWithStockout: number
  totalReferrals30d: number
}

export function getNationalMonthlyKPIs(): NationalMonthlyKPIs {
  const n = DISTRICT_MONTHLY.length || 1
  const sum = (sel: (d: DistrictMonthlySummary) => number) =>
    DISTRICT_MONTHLY.reduce((s, d) => s + sel(d), 0)

  return {
    totalBirths30d: sum((d) => d.births30d),
    totalAllCauseDeaths30d: sum((d) => d.allCauseDeaths30d),
    totalMaternalDeaths30d: sum((d) => d.maternalDeaths30d),
    totalUnder5Deaths30d: sum((d) => d.under5Deaths30d),
    avgReportingCompleteness: Math.round(sum((d) => d.reportingCompletenessPct) / n),
    avgReportingTimeliness: Math.round(sum((d) => d.reportingTimelinessPct) / n),
    avgBedOccupancy: Math.round(sum((d) => d.avgBedOccupancyPct) / n),
    avgDpt3Coverage: Math.round(sum((d) => d.dpt3CoveragePct) / n),
    avgMeasles1Coverage: Math.round(sum((d) => d.measles1CoveragePct) / n),
    totalFacilitiesWithStockout: sum((d) => d.facilitiesWithStockout),
    totalReferrals30d: sum((d) => d.referralsOut30d),
  }
}
