export interface District {
  id: string
  name: string
  region: string
  population: number
  centroid: [number, number]
  isBorderDistrict: boolean
  isRefugeeHosting: boolean
  isUrban: boolean
}

export interface DistrictMetric {
  districtId: string
  disease: string
  cases: number
  deaths: number
  incidencePer100k: number
  weekOnWeekChange: number
  baselineRatio: number
  testPositivity: number
  severityScore: number
  severity: 'none' | 'watch' | 'moderate' | 'high' | 'critical' | 'missing'
  stockRisk: 'ok' | 'watch' | 'high' | 'critical'
  bedOccupancy: number
  reportingComplete: boolean
}
