import { DAILY_REPORTS, getReportsByFacility } from '@/data/daily-reports'

export async function GET(request: Request) {
  const facilityId = new URL(request.url).searchParams.get('facilityId')
  return Response.json(facilityId ? getReportsByFacility(facilityId) : DAILY_REPORTS)
}
