import { create } from 'zustand'
import {
  DEMO_SCENARIOS,
  DEFAULT_SCENARIO,
  type NurseReportOverrides,
} from '@/lib/demo-scenarios'

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

export type ScenarioKey = 'normal' | 'malaria-surge' | 'cholera-alert' | 'stock-crisis'

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
  scenario: ScenarioKey
  setScenario: (s: ScenarioKey) => void

  // Cross-screen scenario data (kept in sync by setScenario)
  nurseReportOverrides: NurseReportOverrides
  capacityPressureDistricts: string[]
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
  setScenario: (s) => {
    const sc = DEMO_SCENARIOS.find((x) => x.key === s) ?? DEFAULT_SCENARIO
    set({
      scenario: s,
      // Cascade the scenario's connected data across every MoH screen.
      selectedDisease: sc.defaultDisease as Disease,
      nurseReportOverrides: sc.nurseReportOverrides,
      capacityPressureDistricts: sc.capacityPressureDistricts,
    })
  },

  nurseReportOverrides: DEFAULT_SCENARIO.nurseReportOverrides,
  capacityPressureDistricts: DEFAULT_SCENARIO.capacityPressureDistricts,
}))
