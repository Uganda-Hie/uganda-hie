import { getNationalSummary, getTopDistricts } from '@/data/districts'
import { DISEASES, type DiseaseKey } from '@/types/disease'
import { formatPercent } from '@/lib/utils'

function diseaseLabel(disease: DiseaseKey): string {
  return DISEASES.find((d) => d.key === disease)?.label ?? disease
}

// Commodity language tailored to each disease's response.
const COMMODITIES: Record<DiseaseKey, string> = {
  malaria: 'RDT and ACT',
  cholera: 'ORS, IV fluids and cholera-kit',
  diarrhoeal: 'ORS and zinc',
  measles: 'measles vaccine',
  tb: 'GeneXpert cartridge and RHZE',
  respiratory: 'antibiotic and oxygen',
  maternal: 'oxytocin and emergency obstetric',
  hiv: 'ART and test-kit',
}

/**
 * 3–4 sentence plain-English MoH briefing populated from live synthetic figures.
 */
export function generateAIBrief(disease: DiseaseKey): string {
  const label = diseaseLabel(disease)
  const summary = getNationalSummary(disease)
  const ranked = getTopDistricts(disease, 100) // all districts, sorted by cases desc
  const reporting = ranked.filter((d) => d.reportingComplete)

  const [a, b, c] = reporting
  const nationalWow = reporting.length
    ? Math.round(reporting.reduce((s, d) => s + d.weekOnWeekChange, 0) / reporting.length)
    : 0

  const fastest = [...reporting].sort((x, y) => y.weekOnWeekChange - x.weekOnWeekChange)[0]
  const commodity = COMMODITIES[disease]

  if (!a || !fastest) {
    return `No complete ${label} reports were received this week. Reporting completeness must be restored before national trends can be assessed. Recommend following up with non-reporting District Health Officers.`
  }

  return (
    `${label} cases this week total ${summary.totalCases.toLocaleString('en-US')} nationally, ` +
    `a ${formatPercent(nationalWow)} change from last week. ` +
    `The three most affected districts are ${a.name}, ${b?.name ?? '—'}, and ${c?.name ?? '—'}. ` +
    `${fastest.name} district shows the fastest growth at ${formatPercent(fastest.weekOnWeekChange)} above baseline. ` +
    `Recommend targeted ${commodity} redistribution to ${a.name} and ${fastest.name} and alert the District Health Officers.`
  )
}

/**
 * Short 1–2 sentence stock warning derived from the top districts' stockRisk.
 */
export function generateStockAlert(disease: DiseaseKey): string {
  const label = diseaseLabel(disease)
  const top = getTopDistricts(disease, 10)
  const atRisk = top.filter((d) => d.stockRisk === 'high' || d.stockRisk === 'critical')

  if (atRisk.length === 0) {
    return `Medicine stock levels are stable across the highest-burden ${label} districts.`
  }

  const named = atRisk.slice(0, 3).map((d) => d.name).join(', ')
  return (
    `${atRisk.length} of the top 10 ${label} districts are at high or critical medicine stock risk, ` +
    `including ${named}. Prioritise resupply before stock-outs compromise treatment.`
  )
}

/**
 * Returns an outbreak flag string only if any district is at critical severity, else null.
 */
export function generateOutbreakFlag(disease: DiseaseKey): string | null {
  const label = diseaseLabel(disease)
  const summary = getNationalSummary(disease)
  if (summary.criticalDistricts === 0) return null

  const worst = getTopDistricts(disease, 100).find((d) => d.severity === 'critical')
  if (!worst) return null

  return (
    `⚠ OUTBREAK ALERT: ${summary.criticalDistricts} district(s) at critical ${label} levels. ` +
    `${worst.name} leads with ${worst.cases.toLocaleString('en-US')} cases ` +
    `(${formatPercent(worst.weekOnWeekChange)} week-on-week). Immediate response-team deployment advised.`
  )
}
