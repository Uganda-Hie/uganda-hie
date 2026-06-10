import { Patient } from '@/types/patient'

export const PATIENTS: Patient[] = [
  {
    hieId: 'HIE-2024-00142',
    name: 'Aciro Grace',
    age: 28, sex: 'F',
    districtId: 'gulu',
    primaryFacilityId: 'f001',
    phone: '+256 772 345 678',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Sulfonamides'],
    conditions: ['Malaria (recurrent)', 'Iron deficiency anaemia'],
    medications: ['Ferrous sulfate 200mg OD', 'Folic acid 5mg OD'],
    lastVisit: '2026-05-28',
    consentStatus: 'full',
    nextOfKin: { name: 'Okello James', relationship: 'Husband', phone: '+256 701 234 567' },
    labResults: [
      { test: 'Malaria RDT', result: 'Positive (P. falciparum)', date: '2026-05-28', facility: 'Gulu RRH', referenceRange: 'N/A (diagnostic)', flag: 'positive', status: 'verified' },
      { test: 'Haemoglobin', result: '9.2 g/dL (Low)', date: '2026-05-28', facility: 'Gulu RRH', referenceRange: '11.0–16.5 g/dL', flag: 'low', status: 'verified' },
      { test: 'Blood Group', result: 'O Rhesus Positive', date: '2025-01-10', facility: 'Lacor Hospital', referenceRange: 'N/A', flag: 'normal', status: 'verified' },
    ],
    referrals: [
      { from: 'Gulu HCIV', to: 'Gulu RRH', reason: 'Severe malaria with anaemia', date: '2026-05-28', status: 'completed' },
      { from: 'Gulu HCIV', to: 'Lacor Hospital', reason: 'Anaemia management — iron infusion', date: '2026-04-15', status: 'completed' },
    ],
  },
  {
    hieId: 'HIE-2024-00389',
    name: 'Ssemakula Robert',
    age: 45, sex: 'M',
    districtId: 'kampala',
    primaryFacilityId: 'f028',
    phone: '+256 752 901 234',
    bloodGroup: 'A+',
    allergies: ['Aspirin'],
    conditions: ['Type 2 Diabetes', 'Hypertension', 'TB (on treatment)'],
    medications: ['Metformin 500mg BD', 'Amlodipine 5mg OD', 'RHZE (TB regime)'],
    lastVisit: '2026-06-01',
    consentStatus: 'full',
    nextOfKin: { name: 'Nakato Sarah', relationship: 'Wife', phone: '+256 703 456 789' },
    labResults: [
      { test: 'HbA1c', result: '8.1% (Poorly controlled)', date: '2026-06-01', facility: 'Mulago NRH', referenceRange: '<7.0% (controlled)', flag: 'high', status: 'verified' },
      { test: 'BP Reading', result: '148/92 mmHg', date: '2026-06-01', facility: 'Mulago NRH', referenceRange: '<130/80 mmHg', flag: 'high', status: 'verified' },
      { test: 'Sputum GeneXpert', result: 'MTB Detected — Rifampicin Sensitive', date: '2026-02-14', facility: 'Mulago NRH', referenceRange: 'N/A (diagnostic)', flag: 'positive', status: 'verified' },
      { test: 'Random Blood Sugar', result: '11.4 mmol/L', date: '2026-06-01', facility: 'Mulago NRH', referenceRange: '3.9–7.8 mmol/L', flag: 'high', status: 'verified' },
    ],
    referrals: [
      { from: 'Kampala HCIV Kiswa', to: 'Mulago NRH', reason: 'TB confirmed, requires specialist NCD co-management', date: '2026-02-15', status: 'completed' },
      { from: 'Mulago NRH', to: 'Mulago NRH TB Clinic', reason: 'TB/NCD co-management specialist review', date: '2026-03-01', status: 'completed' },
    ],
  },
  {
    hieId: 'HIE-2024-00517',
    name: 'Namukasa Fatuma',
    age: 22, sex: 'F',
    districtId: 'wakiso',
    primaryFacilityId: 'f032',
    phone: '+256 776 543 210',
    bloodGroup: 'B+',
    allergies: [],
    conditions: ['G2P1 — 32 weeks pregnant', 'Gestational hypertension'],
    medications: ['Methyldopa 250mg TDS', 'Calcium 600mg OD', 'Ferrous sulfate 200mg BD'],
    lastVisit: '2026-06-03',
    consentStatus: 'full',
    nextOfKin: { name: 'Kizito Allan', relationship: 'Partner', phone: '+256 708 321 654' },
    labResults: [
      { test: 'BP Reading', result: '152/96 mmHg (High)', date: '2026-06-03', facility: 'Entebbe Hospital', referenceRange: '<130/80 mmHg', flag: 'critical', status: 'verified' },
      { test: 'Urine Protein', result: '2+ Proteinuria', date: '2026-06-03', facility: 'Entebbe Hospital', referenceRange: 'Negative', flag: 'high', status: 'preliminary' },
      { test: 'Haemoglobin', result: '10.8 g/dL', date: '2026-05-10', facility: 'Entebbe Hospital', referenceRange: '11.0–16.5 g/dL', flag: 'low', status: 'verified' },
      { test: 'Obstetric Ultrasound', result: 'Single fetus, cephalic, AFI normal', date: '2026-05-10', facility: 'Entebbe Hospital', referenceRange: 'N/A (diagnostic)', flag: 'normal', status: 'verified' },
    ],
    referrals: [
      { from: 'Entebbe Hospital', to: 'Mulago NRH', reason: 'Pre-eclampsia monitoring — high risk obstetric case', date: '2026-06-04', status: 'pending' },
    ],
  },
  {
    hieId: 'HIE-2024-00703',
    name: 'Otim Daniel',
    age: 8, sex: 'M',
    districtId: 'arua',
    primaryFacilityId: 'f004',
    phone: '+256 781 654 321',
    bloodGroup: 'O-',
    allergies: ['Cotrimoxazole'],
    conditions: ['Severe acute malnutrition (recovering)', 'Malaria (history)'],
    medications: ['RUTF (therapeutic food)', 'Vitamin A supplementation'],
    lastVisit: '2026-05-20',
    consentStatus: 'emergency-only',
    nextOfKin: { name: 'Otim Margaret', relationship: 'Mother', phone: '+256 782 111 222' },
    labResults: [
      { test: 'MUAC', result: '11.2 cm (Moderate acute malnutrition)', date: '2026-05-20', facility: 'Arua RRH', referenceRange: '>12.5 cm (normal)', flag: 'low', status: 'verified' },
      { test: 'Malaria RDT', result: 'Negative', date: '2026-05-20', facility: 'Arua RRH', referenceRange: 'N/A', flag: 'negative', status: 'verified' },
      { test: 'Blood Group', result: 'O Rhesus Negative', date: '2026-04-01', facility: 'Arua RRH', referenceRange: 'N/A', flag: 'normal', status: 'verified' },
    ],
    referrals: [
      { from: 'Romogi HCIII', to: 'Arua RRH', reason: 'SAM with complications — inpatient nutrition rehabilitation', date: '2026-04-01', status: 'completed' },
    ],
  },
  {
    hieId: 'HIE-2024-00891',
    name: 'Birungi Prossy',
    age: 55, sex: 'F',
    districtId: 'mbarara',
    primaryFacilityId: 'f024',
    phone: '+256 756 789 012',
    bloodGroup: 'AB+',
    allergies: ['Metronidazole'],
    conditions: ['HIV (on ART)', 'Hypertension', 'Osteoarthritis'],
    medications: ['TDF/3TC/DTG (ART)', 'Amlodipine 10mg OD', 'Ibuprofen 400mg PRN'],
    lastVisit: '2026-05-15',
    consentStatus: 'full',
    nextOfKin: { name: 'Birungi Patrick', relationship: 'Son', phone: '+256 709 876 543' },
    labResults: [
      { test: 'CD4 Count', result: '620 cells/μL (Good)', date: '2026-03-10', facility: 'Mbarara RRH', referenceRange: '>500 cells/μL (good)', flag: 'normal', status: 'verified' },
      { test: 'Viral Load', result: 'Undetectable (<20 copies/mL)', date: '2026-03-10', facility: 'Mbarara RRH', referenceRange: '<20 copies/mL (target)', flag: 'normal', status: 'verified' },
      { test: 'BP Reading', result: '138/86 mmHg', date: '2026-05-15', facility: 'Mbarara RRH', referenceRange: '<130/80 mmHg', flag: 'high', status: 'preliminary' },
      { test: 'Creatinine', result: '82 μmol/L (Normal)', date: '2026-03-10', facility: 'Mbarara RRH', referenceRange: '53–106 μmol/L', flag: 'normal', status: 'verified' },
    ],
    referrals: [],
  },
]

export function getPatientById(hieId: string): Patient | undefined {
  return PATIENTS.find((p) => p.hieId === hieId)
}

export function searchPatients(query: string): Patient[] {
  const q = query.toLowerCase()
  return PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.hieId.toLowerCase().includes(q) ||
      p.phone.includes(q)
  )
}
