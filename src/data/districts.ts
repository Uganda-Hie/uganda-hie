import { District, DistrictMetric } from '@/types/district'
import { DiseaseKey } from '@/types/disease'

export const DISTRICTS: District[] = [
  // NORTHERN UGANDA
  { id: 'gulu',       name: 'Gulu',       region: 'Northern', population: 230000, centroid: [32.2990, 2.7748],  isBorderDistrict: false, isRefugeeHosting: true,  isUrban: true  },
  { id: 'arua',       name: 'Arua',       region: 'Northern', population: 310000, centroid: [30.9107, 3.0200],  isBorderDistrict: true,  isRefugeeHosting: true,  isUrban: true  },
  { id: 'yumbe',      name: 'Yumbe',      region: 'Northern', population: 280000, centroid: [31.2457, 3.4680],  isBorderDistrict: true,  isRefugeeHosting: true,  isUrban: false },
  { id: 'adjumani',   name: 'Adjumani',   region: 'Northern', population: 190000, centroid: [31.7908, 3.3778],  isBorderDistrict: true,  isRefugeeHosting: true,  isUrban: false },
  { id: 'moyo',       name: 'Moyo',       region: 'Northern', population: 130000, centroid: [31.7219, 3.6483],  isBorderDistrict: true,  isRefugeeHosting: false, isUrban: false },
  { id: 'kitgum',     name: 'Kitgum',     region: 'Northern', population: 210000, centroid: [32.8869, 3.2783],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'pader',      name: 'Pader',      region: 'Northern', population: 180000, centroid: [33.1756, 2.9428],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'lira',       name: 'Lira',       region: 'Northern', population: 250000, centroid: [32.8998, 2.2499],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: true  },
  { id: 'alebtong',   name: 'Alebtong',   region: 'Northern', population: 140000, centroid: [33.2167, 2.2333],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'amuru',      name: 'Amuru',      region: 'Northern', population: 160000, centroid: [31.9167, 2.9667],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'nwoya',      name: 'Nwoya',      region: 'Northern', population: 120000, centroid: [31.9000, 2.5833],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'kaabong',    name: 'Kaabong',    region: 'Northern', population: 150000, centroid: [34.1253, 3.5178],  isBorderDistrict: true,  isRefugeeHosting: false, isUrban: false },
  { id: 'kotido',     name: 'Kotido',     region: 'Northern', population: 170000, centroid: [34.1333, 2.9833],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'moroto',     name: 'Moroto',     region: 'Northern', population: 110000, centroid: [34.6667, 2.5333],  isBorderDistrict: true,  isRefugeeHosting: false, isUrban: false },
  { id: 'nakapiripirit', name: 'Nakapiripirit', region: 'Northern', population: 140000, centroid: [34.9167, 1.9000], isBorderDistrict: true, isRefugeeHosting: false, isUrban: false },

  // EASTERN UGANDA
  { id: 'tororo',     name: 'Tororo',     region: 'Eastern',  population: 280000, centroid: [34.1811, 0.6925],  isBorderDistrict: true,  isRefugeeHosting: false, isUrban: true  },
  { id: 'busia',      name: 'Busia',      region: 'Eastern',  population: 190000, centroid: [33.9400, 0.4667],  isBorderDistrict: true,  isRefugeeHosting: false, isUrban: false },
  { id: 'mbale',      name: 'Mbale',      region: 'Eastern',  population: 270000, centroid: [34.1750, 1.0806],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: true  },
  { id: 'sironko',    name: 'Sironko',    region: 'Eastern',  population: 200000, centroid: [34.2333, 1.2333],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'kapchorwa',  name: 'Kapchorwa',  region: 'Eastern',  population: 140000, centroid: [34.4500, 1.4000],  isBorderDistrict: true,  isRefugeeHosting: false, isUrban: false },
  { id: 'soroti',     name: 'Soroti',     region: 'Eastern',  population: 200000, centroid: [33.6111, 1.7147],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: true  },
  { id: 'kumi',       name: 'Kumi',       region: 'Eastern',  population: 180000, centroid: [33.9333, 1.4667],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'pallisa',    name: 'Pallisa',    region: 'Eastern',  population: 220000, centroid: [33.7000, 1.1333],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'budaka',     name: 'Budaka',     region: 'Eastern',  population: 170000, centroid: [33.9333, 1.0000],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'jinja',      name: 'Jinja',      region: 'Eastern',  population: 300000, centroid: [33.2036, 0.4247],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: true  },
  { id: 'iganga',     name: 'Iganga',     region: 'Eastern',  population: 260000, centroid: [33.4667, 0.6089],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'mayuge',     name: 'Mayuge',     region: 'Eastern',  population: 240000, centroid: [33.5833, 0.4500],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },

  // WESTERN UGANDA
  { id: 'kasese',     name: 'Kasese',     region: 'Western',  population: 310000, centroid: [30.0833, 0.1833],  isBorderDistrict: true,  isRefugeeHosting: false, isUrban: true  },
  { id: 'hoima',      name: 'Hoima',      region: 'Western',  population: 250000, centroid: [31.3528, 1.4347],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: true  },
  { id: 'masindi',    name: 'Masindi',    region: 'Western',  population: 220000, centroid: [31.7153, 1.6744],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'mbarara',    name: 'Mbarara',    region: 'Western',  population: 320000, centroid: [30.6583, -0.6072], isBorderDistrict: false, isRefugeeHosting: false, isUrban: true  },
  { id: 'bushenyi',   name: 'Bushenyi',   region: 'Western',  population: 210000, centroid: [30.1833, -0.5500], isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'ntungamo',   name: 'Ntungamo',   region: 'Western',  population: 230000, centroid: [30.2667, -0.8833], isBorderDistrict: true,  isRefugeeHosting: false, isUrban: false },
  { id: 'rukungiri',  name: 'Rukungiri',  region: 'Western',  population: 190000, centroid: [29.9333, -0.8333], isBorderDistrict: true,  isRefugeeHosting: false, isUrban: false },
  { id: 'kabale',     name: 'Kabale',     region: 'Western',  population: 220000, centroid: [29.9894, -1.2492], isBorderDistrict: true,  isRefugeeHosting: false, isUrban: true  },
  { id: 'kisoro',     name: 'Kisoro',     region: 'Western',  population: 180000, centroid: [29.6833, -1.2833], isBorderDistrict: true,  isRefugeeHosting: false, isUrban: false },
  { id: 'bundibugyo', name: 'Bundibugyo', region: 'Western',  population: 160000, centroid: [30.0600, 0.7200],  isBorderDistrict: true,  isRefugeeHosting: false, isUrban: false },

  // CENTRAL UGANDA
  { id: 'kampala',    name: 'Kampala',    region: 'Central',  population: 1680000,centroid: [32.5811, 0.3136],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: true  },
  { id: 'wakiso',     name: 'Wakiso',     region: 'Central',  population: 1400000,centroid: [32.3667, 0.3667],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: true  },
  { id: 'mukono',     name: 'Mukono',     region: 'Central',  population: 370000, centroid: [32.7556, 0.3536],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'mpigi',      name: 'Mpigi',      region: 'Central',  population: 200000, centroid: [32.3167, 0.2167],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'butebo',     name: 'Butebo',     region: 'Central',  population: 130000, centroid: [34.1000, 1.1500],  isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'kalangala',  name: 'Kalangala',  region: 'Central',  population: 55000,  centroid: [32.2000, -0.3167], isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
  { id: 'masaka',     name: 'Masaka',     region: 'Central',  population: 250000, centroid: [31.7333, -0.3333], isBorderDistrict: false, isRefugeeHosting: false, isUrban: true  },
  { id: 'rakai',      name: 'Rakai',      region: 'Central',  population: 200000, centroid: [31.4000, -0.7167], isBorderDistrict: true,  isRefugeeHosting: false, isUrban: false },
  { id: 'lyantonde',  name: 'Lyantonde',  region: 'Central',  population: 110000, centroid: [31.1500, -0.4000], isBorderDistrict: false, isRefugeeHosting: false, isUrban: false },
]

// ── Seeded pseudo-random (deterministic — same numbers every run) ──────────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

// ── Severity calculator ───────────────────────────────────────────────────
function getSeverity(
  cases: number,
  critical: number,
  high: number,
  wowChange: number,
  hasData: boolean
): DistrictMetric['severity'] {
  if (!hasData) return 'missing'
  if (cases === 0) return 'none'
  if (cases >= critical || wowChange > 100) return 'critical'
  if (cases >= high    || wowChange > 60)  return 'high'
  if (cases >= high / 2) return 'moderate'
  return 'watch'
}

// ── Disease thresholds (cases → severity) ─────────────────────────────────
const THRESHOLDS: Record<DiseaseKey, { critical: number; high: number }> = {
  malaria:     { critical: 200, high: 50  },
  cholera:     { critical: 10,  high: 3   },
  measles:     { critical: 5,   high: 2   },
  tb:          { critical: 30,  high: 10  },
  respiratory: { critical: 100, high: 40  },
  diarrhoeal:  { critical: 80,  high: 30  },
  maternal:    { critical: 3,   high: 1   },
  hiv:         { critical: 50,  high: 20  },
}

// ── Base case multipliers per region × disease ────────────────────────────
const REGION_BIAS: Record<string, Record<DiseaseKey, number>> = {
  Northern: { malaria: 1.8, cholera: 1.2, measles: 0.9, tb: 1.1, respiratory: 1.0, diarrhoeal: 1.3, maternal: 1.4, hiv: 0.9 },
  Eastern:  { malaria: 1.5, cholera: 1.4, measles: 0.8, tb: 1.0, respiratory: 0.9, diarrhoeal: 1.4, maternal: 1.1, hiv: 1.2 },
  Western:  { malaria: 0.7, cholera: 0.6, measles: 1.1, tb: 1.2, respiratory: 1.1, diarrhoeal: 0.8, maternal: 0.8, hiv: 1.3 },
  Central:  { malaria: 0.9, cholera: 0.8, measles: 1.2, tb: 1.3, respiratory: 1.4, diarrhoeal: 0.9, maternal: 0.7, hiv: 1.5 },
}

// ── Generate all district metrics ─────────────────────────────────────────
export function generateDistrictMetrics(disease: DiseaseKey): DistrictMetric[] {
  const rand   = seededRandom(disease.length * 31 + 7)
  const thresh = THRESHOLDS[disease]

  return DISTRICTS.map((d) => {
    const bias    = REGION_BIAS[d.region]?.[disease] ?? 1.0
    const popScale = d.population / 200000
    const r       = rand()

    // refugee / border boost for cholera / diarrhoeal
    const contextBoost =
      (d.isRefugeeHosting && (disease === 'cholera' || disease === 'diarrhoeal')) ? 1.6 :
      (d.isBorderDistrict && disease === 'cholera') ? 1.3 : 1.0

    const baseCases  = Math.round(thresh.high * bias * popScale * contextBoost * (0.3 + r * 1.4))
    const prevCases  = Math.round(baseCases * (0.5 + rand() * 0.9))
    const wowChange  = prevCases > 0 ? Math.round(((baseCases - prevCases) / prevCases) * 100) : 0
    const deaths     = Math.round(baseCases * (0.01 + rand() * 0.04))
    const incidence  = parseFloat(((baseCases / d.population) * 100000).toFixed(1))
    const positivity = parseFloat((5 + rand() * 35).toFixed(1))
    const hasData    = rand() > 0.08   // ~8% missing reports

    const severityScore = Math.min(
      100,
      Math.round(
        (baseCases / thresh.critical) * 50 +
        (Math.max(0, wowChange) / 100) * 30 +
        (deaths / Math.max(baseCases, 1)) * 20
      )
    )

    const daysOfStock = Math.round(7 + rand() * 40)
    const stockRisk: DistrictMetric['stockRisk'] =
      daysOfStock < 7  ? 'critical' :
      daysOfStock < 14 ? 'high' :
      daysOfStock < 30 ? 'watch' : 'ok'

    const bedOccupancy = Math.round(40 + rand() * 55)

    return {
      districtId: d.id,
      disease,
      cases: hasData ? baseCases : 0,
      deaths: hasData ? deaths : 0,
      incidencePer100k: hasData ? incidence : 0,
      weekOnWeekChange: hasData ? wowChange : 0,
      baselineRatio: parseFloat((baseCases / Math.max(prevCases, 1)).toFixed(2)),
      testPositivity: hasData ? positivity : 0,
      severityScore: hasData ? severityScore : 0,
      severity: getSeverity(baseCases, thresh.critical, thresh.high, wowChange, hasData),
      stockRisk,
      bedOccupancy,
      reportingComplete: hasData,
    }
  })
}

// ── Convenience: top N districts by cases ─────────────────────────────────
export function getTopDistricts(disease: DiseaseKey, n = 10): Array<District & DistrictMetric> {
  const metrics = generateDistrictMetrics(disease)
  return metrics
    .sort((a, b) => b.cases - a.cases)
    .slice(0, n)
    .map((m) => ({
      ...DISTRICTS.find((d) => d.id === m.districtId)!,
      ...m,
    }))
}

// ── National summary ──────────────────────────────────────────────────────
export function getNationalSummary(disease: DiseaseKey) {
  const metrics = generateDistrictMetrics(disease)
  const reporting = metrics.filter((m) => m.reportingComplete)

  return {
    totalCases:        reporting.reduce((s, m) => s + m.cases, 0),
    totalDeaths:       reporting.reduce((s, m) => s + m.deaths, 0),
    criticalDistricts: reporting.filter((m) => m.severity === 'critical').length,
    highDistricts:     reporting.filter((m) => m.severity === 'high').length,
    missingReports:    metrics.filter((m) => !m.reportingComplete).length,
    avgBedOccupancy:   Math.round(reporting.reduce((s, m) => s + m.bedOccupancy, 0) / reporting.length),
    stockAtRisk:       reporting.filter((m) => m.stockRisk === 'critical' || m.stockRisk === 'high').length,
  }
}
