export type StockCategory = 'medicine' | 'test' | 'vaccine' | 'supply'
export type StockRisk = 'ok' | 'watch' | 'high' | 'critical'

export interface StockItem {
  id: string
  name: string
  category: StockCategory
  unitLabel: string
}

export interface StockLevel {
  item: StockItem
  stockOnHand: number
  dailyConsumption: number
  daysOfStock: number
  riskLevel: StockRisk
  lastUpdated: string
}

export const STOCK_ITEMS: StockItem[] = [
  { id: 'acts',        name: 'ACTs (Artemether-Lumefantrine)', category: 'medicine', unitLabel: 'doses' },
  { id: 'rdts',        name: 'RDTs (Malaria Rapid Tests)',     category: 'test',     unitLabel: 'tests' },
  { id: 'amoxicillin', name: 'Amoxicillin',                    category: 'medicine', unitLabel: 'capsules' },
  { id: 'ors-zinc',    name: 'ORS / Zinc',                     category: 'medicine', unitLabel: 'sachets' },
  { id: 'oxytocin',    name: 'Oxytocin',                       category: 'medicine', unitLabel: 'ampoules' },
  { id: 'measles-vaccine', name: 'Measles Vaccine',            category: 'vaccine',  unitLabel: 'doses' },
  { id: 'arvs',        name: 'ARVs (TDF/3TC/DTG)',             category: 'medicine', unitLabel: 'bottles' },
  { id: 'tb-drugs',    name: 'TB Drugs (RHZE)',                category: 'medicine', unitLabel: 'blisters' },
  { id: 'oxygen',      name: 'Oxygen Cylinders',               category: 'supply',   unitLabel: 'cylinders' },
  { id: 'gloves',      name: 'Gloves',                         category: 'supply',   unitLabel: 'boxes' },
  { id: 'blood',       name: 'Blood Units',                    category: 'supply',   unitLabel: 'units' },
]

// ── Seeded pseudo-random (deterministic per facility) ──────────────────────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function charSum(str: string): number {
  return [...str].reduce((sum, c) => sum + c.charCodeAt(0), 0)
}

function riskFromDays(days: number): StockRisk {
  if (days < 7) return 'critical'
  if (days < 14) return 'high'
  if (days < 30) return 'watch'
  return 'ok'
}

// Typical daily-consumption baselines per commodity (scaled by facility noise).
const CONSUMPTION_BASE: Record<string, number> = {
  acts: 18, rdts: 24, amoxicillin: 30, 'ors-zinc': 20, oxytocin: 4,
  'measles-vaccine': 6, arvs: 8, 'tb-drugs': 3, oxygen: 5, gloves: 12, blood: 2,
}

export function generateStockLevels(facilityId: string): StockLevel[] {
  const rand = seededRandom(charSum(facilityId) * 97 + 13)

  return STOCK_ITEMS.map((item) => {
    const base = CONSUMPTION_BASE[item.id] ?? 10
    const dailyConsumption = Math.max(1, Math.round(base * (0.6 + rand() * 0.9)))
    // Aim for a spread of days-of-stock from ~3 to ~60.
    const targetDays = Math.round(3 + rand() * 57)
    const stockOnHand = dailyConsumption * targetDays
    const daysOfStock = Math.round(stockOnHand / dailyConsumption)
    const daysAgo = Math.floor(rand() * 5) // 0–4 days ago
    const lastUpdated = `2026-06-${String(8 - daysAgo).padStart(2, '0')}`

    return {
      item,
      stockOnHand,
      dailyConsumption,
      daysOfStock,
      riskLevel: riskFromDays(daysOfStock),
      lastUpdated,
    }
  })
}

export function getCriticalStock(facilityId: string): StockLevel[] {
  return generateStockLevels(facilityId).filter(
    (s) => s.riskLevel === 'critical' || s.riskLevel === 'high'
  )
}
