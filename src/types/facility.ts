export type FacilityLevel = 'HCII' | 'HCIII' | 'HCIV' | 'Hospital' | 'RRH' | 'NRH'
export type FacilityOwnership = 'Government' | 'PNFP' | 'Private'

export interface Facility {
  id: string
  name: string
  districtId: string
  level: FacilityLevel
  ownership: FacilityOwnership
  totalBeds: number
  hasOxygen: boolean
  hasAmbulance: boolean
  coordinates: [number, number]
}
