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

// Static fallbacks if live generation ever throws (demo must never break).
const FALLBACK_BRIEFS: Record<string, string> = {
  malaria:
    'Malaria remains the leading disease burden nationally with elevated case counts in northern and eastern districts this reporting period. Districts bordering South Sudan and DRC show the highest incidence per 100,000. Recommend targeted RDT and ACT redistribution to Arua, Yumbe, and Tororo districts and immediate alert to District Health Officers in the top three affected areas.',
  cholera:
    'Cholera signals detected in lakeside and border districts this week. Tororo and Busia show clustering consistent with water source contamination near landing sites. Recommend emergency WASH response activation and oral rehydration salt pre-positioning at affected facilities.',
  measles:
    'Measles cases have been reported in districts with below-target immunisation coverage. Low DPT3 and measles vaccine uptake in remote districts creates conditions for sustained transmission. Recommend emergency catch-up immunisation campaign in flagged districts.',
  tb: 'Tuberculosis notifications are consistent with prior reporting periods. Urban districts including Kampala and Wakiso account for the highest absolute case counts. Recommend GeneXpert capacity review at high-volume facilities and enhanced contact tracing protocols.',
  respiratory:
    'Acute respiratory infection is the second most common OPD diagnosis nationally. Seasonal patterns consistent with this period. No unusual clustering detected. Continue standard surveillance protocols.',
  diarrhoeal:
    'Diarrhoeal disease burden remains elevated in districts with limited water and sanitation access. Refugee-hosting districts in northern Uganda show disproportionate burden. ORS and Zinc stock levels should be reviewed at HCIII level.',
  maternal:
    'Maternal complication alerts have been filed from multiple facilities this reporting period. Referral pathways from lower-level facilities to regional referral hospitals require urgent review. Recommend emergency obstetric care readiness assessment.',
  hiv: 'HIV positive test rates are within expected ranges nationally. ART coverage remains strong in western and central districts. Gaps identified in Karamoja sub-region. Recommend outreach testing and ART initiation support for hard-to-reach populations.',
}

/**
 * 3–4 sentence plain-English MoH briefing populated from live synthetic figures.
 * Falls back to a static brief if anything throws.
 */
export function generateAIBrief(disease: DiseaseKey): string {
  try {
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
  } catch {
    return FALLBACK_BRIEFS[disease] ?? FALLBACK_BRIEFS.malaria
  }
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
