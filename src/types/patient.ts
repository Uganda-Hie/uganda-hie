export interface Patient {
  hieId: string
  name: string
  age: number
  sex: 'M' | 'F'
  districtId: string
  primaryFacilityId: string
  phone: string
  bloodGroup: string
  allergies: string[]
  conditions: string[]
  medications: string[]
  lastVisit: string
  consentStatus: 'full' | 'emergency-only' | 'none'
  nextOfKin: {
    name: string
    relationship: string
    phone: string
  }
  labResults: {
    test: string
    result: string
    date: string
    facility: string
    referenceRange?: string
    flag?: 'normal' | 'low' | 'high' | 'critical' | 'positive' | 'negative'
    status?: 'verified' | 'preliminary' | 'corrected'
  }[]
  referrals: {
    from: string
    to: string
    reason: string
    date: string
    status: 'pending' | 'completed' | 'cancelled'
  }[]
}
