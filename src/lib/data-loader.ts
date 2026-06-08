// Unified re-export of all data-access functions so components can import
// everything from one place.

export {
  DISTRICTS,
  generateDistrictMetrics,
  getTopDistricts,
  getNationalSummary,
} from '@/data/districts'

export {
  FACILITIES,
  getFacilityById,
  getFacilitiesByDistrict,
} from '@/data/facilities'

export { PATIENTS, getPatientById, searchPatients } from '@/data/patients'

export { STOCK_ITEMS, generateStockLevels } from '@/data/stock'

export { CLAIMS, getClaimsByStatus, getClaimsByFacility } from '@/data/claims'

export { AUDIT_LOGS, getFlaggedLogs, getLogsByPatient } from '@/data/audit-logs'

export { getNationalKPIs } from '@/lib/metrics'

export {
  generateAIBrief,
  generateStockAlert,
  generateOutbreakFlag,
} from '@/lib/ai-insights'

// Seed-integrated datasets (weekly disease time-series + monthly district KPIs).
export {
  getNationalWeeklyTrend,
  getWeeklyTrend,
  getDistrictLatestWeek,
} from '@/data/disease-weekly'

export {
  getNationalMonthlyKPIs,
  getMonthlySummary,
  DISTRICT_MONTHLY,
} from '@/data/district-monthly'
