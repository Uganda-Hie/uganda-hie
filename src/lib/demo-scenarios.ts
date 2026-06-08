export interface DemoScenario {
  key: string
  label: string
  description: string
  disease: string
  alertDistricts: Record<string, 'critical' | 'high'>
  aiOverride?: string
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    key: 'normal',
    label: 'Normal Surveillance',
    description: 'Baseline national health picture',
    disease: 'malaria',
    alertDistricts: {},
  },
  {
    key: 'malaria-surge',
    label: '🔴 Malaria Surge — North',
    description: 'Active outbreak in northern refugee-hosting districts',
    disease: 'malaria',
    alertDistricts: {
      arua: 'critical',
      yumbe: 'critical',
      adjumani: 'critical',
      moyo: 'high',
      gulu: 'high',
      kitgum: 'high',
      lira: 'high',
    },
    aiOverride:
      'URGENT: Malaria cases in Arua and Yumbe have exceeded the critical threshold, recording 2.3× and 2.8× above district baselines respectively. The surge is consistent with seasonal peak patterns amplified by high population density in refugee settlements. Adjumani district has also crossed the critical threshold. Immediate ACT and RDT pre-positioning is recommended for Arua RRH, Yumbe Hospital, and Adjumani HCIV. District Health Officers in all three districts should be alerted within the hour.',
  },
  {
    key: 'cholera-alert',
    label: '🟠 Cholera Alert — Lakeside',
    description: 'Cluster detected near Lake Victoria landing sites',
    disease: 'cholera',
    alertDistricts: {
      tororo: 'critical',
      busia: 'critical',
      mayuge: 'high',
      jinja: 'high',
      iganga: 'high',
    },
    aiOverride:
      'ALERT: A cholera cluster has been detected in Tororo and Busia districts consistent with contaminated water sources at Lake Victoria landing sites. Case investigation is ongoing. Oral rehydration salts and IV fluids are at watch-level stock in both districts. WASH emergency response activation is recommended. Jinja, Mayuge, and Iganga are classified as high-risk due to proximity and shared water sources. Population advisories should be issued immediately.',
  },
  {
    key: 'stock-crisis',
    label: '📦 ACT Stock Crisis',
    description: 'Critical ACT shortage across 12 northern facilities',
    disease: 'malaria',
    alertDistricts: {
      kaabong: 'critical',
      kotido: 'critical',
      moroto: 'critical',
      arua: 'high',
      gulu: 'high',
      lira: 'high',
      kitgum: 'high',
      pader: 'high',
    },
    aiOverride:
      'CRITICAL STOCK ALERT: Artemether-Lumefantrine (ACT) stocks have fallen below the 7-day critical threshold at 12 facilities across northern Uganda. Kaabong, Kotido, and Moroto districts are at immediate stock-out risk. Given current malaria case loads, facilities in these districts will exhaust ACT supply within 4 days without emergency resupply. National Medical Stores emergency order recommended immediately. Interim: redistribute surplus ACT stock from Kampala and Wakiso facilities to cover the north.',
  },
]

export const DEFAULT_SCENARIO = DEMO_SCENARIOS[0]
