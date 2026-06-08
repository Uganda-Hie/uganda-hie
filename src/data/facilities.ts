import { Facility } from '@/types/facility'

export const FACILITIES: Facility[] = [
  // NORTHERN — Gulu
  { id: 'f001', name: 'Gulu Regional Referral Hospital',    districtId: 'gulu',    level: 'RRH',      ownership: 'Government', totalBeds: 400, hasOxygen: true,  hasAmbulance: true,  coordinates: [32.2990, 2.7748] },
  { id: 'f002', name: 'Lacor Hospital',                     districtId: 'gulu',    level: 'Hospital', ownership: 'PNFP',       totalBeds: 482, hasOxygen: true,  hasAmbulance: true,  coordinates: [32.2750, 2.7900] },
  { id: 'f003', name: 'Gulu HCIV',                          districtId: 'gulu',    level: 'HCIV',     ownership: 'Government', totalBeds: 60,  hasOxygen: true,  hasAmbulance: false, coordinates: [32.3050, 2.7600] },
  // NORTHERN — Arua
  { id: 'f004', name: 'Arua Regional Referral Hospital',    districtId: 'arua',    level: 'RRH',      ownership: 'Government', totalBeds: 330, hasOxygen: true,  hasAmbulance: true,  coordinates: [30.9107, 3.0200] },
  { id: 'f005', name: 'Kuluva Hospital',                    districtId: 'arua',    level: 'Hospital', ownership: 'PNFP',       totalBeds: 220, hasOxygen: true,  hasAmbulance: true,  coordinates: [30.8900, 3.0500] },
  { id: 'f006', name: 'Arua HCIII',                         districtId: 'arua',    level: 'HCIII',    ownership: 'Government', totalBeds: 20,  hasOxygen: false, hasAmbulance: false, coordinates: [30.9200, 3.0100] },
  // NORTHERN — Yumbe (refugee hosting)
  { id: 'f007', name: 'Yumbe Hospital',                     districtId: 'yumbe',   level: 'Hospital', ownership: 'Government', totalBeds: 180, hasOxygen: true,  hasAmbulance: true,  coordinates: [31.2457, 3.4680] },
  { id: 'f008', name: 'Kuluba HCIV',                        districtId: 'yumbe',   level: 'HCIV',     ownership: 'Government', totalBeds: 40,  hasOxygen: false, hasAmbulance: false, coordinates: [31.2600, 3.4500] },
  { id: 'f009', name: 'Romogi HCIII',                       districtId: 'yumbe',   level: 'HCIII',    ownership: 'Government', totalBeds: 10,  hasOxygen: false, hasAmbulance: false, coordinates: [31.2200, 3.4900] },
  // NORTHERN — Kaabong (remote)
  { id: 'f010', name: 'Kaabong Hospital',                   districtId: 'kaabong', level: 'Hospital', ownership: 'Government', totalBeds: 100, hasOxygen: true,  hasAmbulance: false, coordinates: [34.1253, 3.5178] },
  { id: 'f011', name: 'Karenga HCIII',                      districtId: 'kaabong', level: 'HCIII',    ownership: 'Government', totalBeds: 8,   hasOxygen: false, hasAmbulance: false, coordinates: [34.0900, 3.5500] },
  // NORTHERN — Lira
  { id: 'f012', name: 'Lira Regional Referral Hospital',    districtId: 'lira',    level: 'RRH',      ownership: 'Government', totalBeds: 350, hasOxygen: true,  hasAmbulance: true,  coordinates: [32.8998, 2.2499] },
  { id: 'f013', name: 'St. Joseph Hospital Lira',           districtId: 'lira',    level: 'Hospital', ownership: 'PNFP',       totalBeds: 200, hasOxygen: true,  hasAmbulance: true,  coordinates: [32.9100, 2.2600] },
  // EASTERN — Tororo
  { id: 'f014', name: 'Tororo General Hospital',            districtId: 'tororo',  level: 'Hospital', ownership: 'Government', totalBeds: 200, hasOxygen: true,  hasAmbulance: true,  coordinates: [34.1811, 0.6925] },
  { id: 'f015', name: 'Tororo HCIV',                        districtId: 'tororo',  level: 'HCIV',     ownership: 'Government', totalBeds: 40,  hasOxygen: true,  hasAmbulance: false, coordinates: [34.1900, 0.6800] },
  // EASTERN — Mbale
  { id: 'f016', name: 'Mbale Regional Referral Hospital',   districtId: 'mbale',   level: 'RRH',      ownership: 'Government', totalBeds: 380, hasOxygen: true,  hasAmbulance: true,  coordinates: [34.1750, 1.0806] },
  { id: 'f017', name: 'Mbale Islamic Hospital',             districtId: 'mbale',   level: 'Hospital', ownership: 'PNFP',       totalBeds: 150, hasOxygen: true,  hasAmbulance: false, coordinates: [34.1600, 1.0900] },
  // EASTERN — Jinja
  { id: 'f018', name: 'Jinja Regional Referral Hospital',   districtId: 'jinja',   level: 'RRH',      ownership: 'Government', totalBeds: 310, hasOxygen: true,  hasAmbulance: true,  coordinates: [33.2036, 0.4247] },
  { id: 'f019', name: 'Jinja HCIV',                         districtId: 'jinja',   level: 'HCIV',     ownership: 'Government', totalBeds: 50,  hasOxygen: true,  hasAmbulance: false, coordinates: [33.2100, 0.4300] },
  // EASTERN — Busia (border/lakeside)
  { id: 'f020', name: 'Busia Hospital',                     districtId: 'busia',   level: 'Hospital', ownership: 'Government', totalBeds: 120, hasOxygen: true,  hasAmbulance: true,  coordinates: [33.9400, 0.4667] },
  { id: 'f021', name: 'Busia HCIII',                        districtId: 'busia',   level: 'HCIII',    ownership: 'Government', totalBeds: 15,  hasOxygen: false, hasAmbulance: false, coordinates: [33.9300, 0.4800] },
  // WESTERN — Kasese
  { id: 'f022', name: 'Bwera Hospital',                     districtId: 'kasese',  level: 'Hospital', ownership: 'Government', totalBeds: 160, hasOxygen: true,  hasAmbulance: true,  coordinates: [29.9167, 0.1000] },
  { id: 'f023', name: 'Kasese HCIV',                        districtId: 'kasese',  level: 'HCIV',     ownership: 'Government', totalBeds: 45,  hasOxygen: true,  hasAmbulance: false, coordinates: [30.0833, 0.1833] },
  // WESTERN — Mbarara
  { id: 'f024', name: 'Mbarara Regional Referral Hospital', districtId: 'mbarara', level: 'RRH',      ownership: 'Government', totalBeds: 500, hasOxygen: true,  hasAmbulance: true,  coordinates: [30.6583, -0.6072] },
  { id: 'f025', name: 'Ruharo Mission Hospital',            districtId: 'mbarara', level: 'Hospital', ownership: 'PNFP',       totalBeds: 200, hasOxygen: true,  hasAmbulance: true,  coordinates: [30.6700, -0.6200] },
  // WESTERN — Hoima
  { id: 'f026', name: 'Hoima Regional Referral Hospital',   districtId: 'hoima',   level: 'RRH',      ownership: 'Government', totalBeds: 280, hasOxygen: true,  hasAmbulance: true,  coordinates: [31.3528, 1.4347] },
  // WESTERN — Kabale
  { id: 'f027', name: 'Kabale Regional Referral Hospital',  districtId: 'kabale',  level: 'RRH',      ownership: 'Government', totalBeds: 260, hasOxygen: true,  hasAmbulance: true,  coordinates: [29.9894, -1.2492] },
  // CENTRAL — Kampala
  { id: 'f028', name: 'Mulago National Referral Hospital',  districtId: 'kampala', level: 'NRH',      ownership: 'Government', totalBeds: 1500,hasOxygen: true,  hasAmbulance: true,  coordinates: [32.5811, 0.3400] },
  { id: 'f029', name: 'Kiruddu General Hospital',           districtId: 'kampala', level: 'Hospital', ownership: 'Government', totalBeds: 220, hasOxygen: true,  hasAmbulance: true,  coordinates: [32.5700, 0.2900] },
  { id: 'f030', name: 'Kawempe General Hospital',           districtId: 'kampala', level: 'Hospital', ownership: 'Government', totalBeds: 200, hasOxygen: true,  hasAmbulance: true,  coordinates: [32.5600, 0.3600] },
  { id: 'f031', name: 'Kampala HCIV Kiswa',                 districtId: 'kampala', level: 'HCIV',     ownership: 'Government', totalBeds: 60,  hasOxygen: true,  hasAmbulance: false, coordinates: [32.5900, 0.3200] },
  // CENTRAL — Wakiso
  { id: 'f032', name: 'Entebbe Hospital',                   districtId: 'wakiso',  level: 'Hospital', ownership: 'Government', totalBeds: 180, hasOxygen: true,  hasAmbulance: true,  coordinates: [32.4630, 0.0560] },
  { id: 'f033', name: 'Kiwoko Hospital',                    districtId: 'wakiso',  level: 'Hospital', ownership: 'PNFP',       totalBeds: 210, hasOxygen: true,  hasAmbulance: true,  coordinates: [32.0667, 0.6167] },
  { id: 'f034', name: 'Wakiso HCIV',                        districtId: 'wakiso',  level: 'HCIV',     ownership: 'Government', totalBeds: 40,  hasOxygen: true,  hasAmbulance: false, coordinates: [32.3667, 0.3667] },
  // CENTRAL — Kalangala (island)
  { id: 'f035', name: 'Kalangala HCIV',                     districtId: 'kalangala',level: 'HCIV',    ownership: 'Government', totalBeds: 30,  hasOxygen: false, hasAmbulance: false, coordinates: [32.2000, -0.3167] },
  { id: 'f036', name: 'Bufumira HCII',                      districtId: 'kalangala',level: 'HCII',    ownership: 'Government', totalBeds: 6,   hasOxygen: false, hasAmbulance: false, coordinates: [32.1500, -0.2500] },
]

export function getFacilitiesByDistrict(districtId: string): Facility[] {
  return FACILITIES.filter((f) => f.districtId === districtId)
}

export function getFacilityById(id: string): Facility | undefined {
  return FACILITIES.find((f) => f.id === id)
}
