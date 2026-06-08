export type DiseaseKey =
  | 'malaria' | 'cholera' | 'measles' | 'tb'
  | 'respiratory' | 'diarrhoeal' | 'maternal' | 'hiv'

export interface DiseaseConfig {
  key: DiseaseKey
  label: string
  color: string
  criticalThreshold: number
  highThreshold: number
  unit: string
}

export const DISEASES: DiseaseConfig[] = [
  { key: 'malaria',     label: 'Malaria',              color: '#e63946', criticalThreshold: 200, highThreshold: 50,  unit: 'cases' },
  { key: 'cholera',     label: 'Cholera',              color: '#f4a261', criticalThreshold: 10,  highThreshold: 3,   unit: 'cases' },
  { key: 'measles',     label: 'Measles',              color: '#e9c46a', criticalThreshold: 5,   highThreshold: 2,   unit: 'cases' },
  { key: 'tb',          label: 'Tuberculosis',         color: '#8338ec', criticalThreshold: 30,  highThreshold: 10,  unit: 'cases' },
  { key: 'respiratory', label: 'Respiratory Infection',color: '#3a86ff', criticalThreshold: 100, highThreshold: 40,  unit: 'cases' },
  { key: 'diarrhoeal',  label: 'Diarrhoeal Disease',   color: '#06d6a0', criticalThreshold: 80,  highThreshold: 30,  unit: 'cases' },
  { key: 'maternal',    label: 'Maternal Alerts',      color: '#ff006e', criticalThreshold: 3,   highThreshold: 1,   unit: 'alerts' },
  { key: 'hiv',         label: 'HIV/ART',              color: '#fb5607', criticalThreshold: 50,  highThreshold: 20,  unit: 'cases' },
]
