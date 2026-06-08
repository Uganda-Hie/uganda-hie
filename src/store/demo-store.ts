import { create } from 'zustand'

export type DemoRole =
  | 'moh-analyst'
  | 'facility-nurse'
  | 'doctor'
  | 'patient'
  | 'insurer'
  | 'admin'

export type Disease =
  | 'malaria'
  | 'cholera'
  | 'measles'
  | 'tb'
  | 'respiratory'
  | 'maternal'
  | 'diarrhoeal'

export type TimeRange = 'today' | '7days' | '30days' | 'quarter'

interface DemoStore {
  // Role
  activeRole: DemoRole
  setRole: (role: DemoRole) => void

  // Disease map
  selectedDisease: Disease
  setDisease: (disease: Disease) => void

  selectedTimeRange: TimeRange
  setTimeRange: (range: TimeRange) => void

  mapVisible: boolean
  setMapVisible: (v: boolean) => void

  // Selected district (for drilldown)
  selectedDistrict: string | null
  setSelectedDistrict: (id: string | null) => void

  // Emergency access
  emergencyAccessActive: boolean
  setEmergencyAccess: (v: boolean) => void

  // Demo scenario
  scenario: 'normal' | 'malaria-surge' | 'cholera-alert' | 'stock-crisis'
  setScenario: (s: DemoStore['scenario']) => void
}

export const useDemoStore = create<DemoStore>((set) => ({
  activeRole: 'moh-analyst',
  setRole: (role) => set({ activeRole: role }),

  selectedDisease: 'malaria',
  setDisease: (disease) => set({ selectedDisease: disease }),

  selectedTimeRange: '7days',
  setTimeRange: (range) => set({ selectedTimeRange: range }),

  mapVisible: false,
  setMapVisible: (v) => set({ mapVisible: v }),

  selectedDistrict: null,
  setSelectedDistrict: (id) => set({ selectedDistrict: id }),

  emergencyAccessActive: false,
  setEmergencyAccess: (v) => set({ emergencyAccessActive: v }),

  scenario: 'normal',
  setScenario: (s) => set({ scenario: s }),
}))
