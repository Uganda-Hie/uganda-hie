import { generateDistrictMetrics, getNationalSummary } from '@/data/districts'
import { FACILITIES } from '@/data/facilities'
import { DAILY_REPORTS, getLatestReport } from '@/data/daily-reports'

export interface NationalKPIs {
  totalFacilitiesReporting: number
  reportingCompleteness: string
  totalBirthsToday: number
  totalDeathsToday: number
  activeAlerts: number
  avgBedOccupancy: number
  facilitiesWithStockRisk: number
}

/**
 * National-level KPIs for the MoH command center.
 * Derived entirely from the synthetic district / facility / daily-report data.
 * Disease-level figures default to malaria (the headline burden).
 */
export function getNationalKPIs(): NationalKPIs {
  // Facilities that have submitted at least one daily report.
  const reportingFacilityIds = [...new Set(DAILY_REPORTS.map((r) => r.facilityId))]
  const latestReports = reportingFacilityIds
    .map((id) => getLatestReport(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))

  // Reporting completeness: share of districts with a complete report.
  const metrics = generateDistrictMetrics('malaria')
  const complete = metrics.filter((m) => m.reportingComplete).length
  const reportingCompleteness = `${Math.round((complete / metrics.length) * 100)}%`

  const totalBirthsToday = latestReports.reduce((s, r) => s + r.births, 0)
  const totalDeathsToday = latestReports.reduce(
    (s, r) =>
      s + r.neonatalDeaths + r.under5Deaths + r.maternalDeaths + r.adultDeaths + r.stillbirths,
    0
  )

  const summary = getNationalSummary('malaria')

  const avgBedOccupancy = latestReports.length
    ? Math.round(
        (latestReports.reduce((s, r) => s + r.occupiedBeds / r.totalBeds, 0) /
          latestReports.length) *
          100
      )
    : summary.avgBedOccupancy

  return {
    totalFacilitiesReporting: reportingFacilityIds.length,
    reportingCompleteness,
    totalBirthsToday,
    totalDeathsToday,
    activeAlerts: summary.criticalDistricts + summary.highDistricts,
    avgBedOccupancy,
    facilitiesWithStockRisk: summary.stockAtRisk,
  }
}

/** Total beds vs occupied across all reporting facilities (capacity view helper). */
export function getCapacityTotals() {
  const reportingFacilityIds = [...new Set(DAILY_REPORTS.map((r) => r.facilityId))]
  const latestReports = reportingFacilityIds
    .map((id) => getLatestReport(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))

  const totalBeds = latestReports.reduce((s, r) => s + r.totalBeds, 0)
  const occupiedBeds = latestReports.reduce((s, r) => s + r.occupiedBeds, 0)

  return {
    totalBeds,
    occupiedBeds,
    freeBeds: totalBeds - occupiedBeds,
    occupancyRate: totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
    facilitiesInRegistry: FACILITIES.length,
  }
}
