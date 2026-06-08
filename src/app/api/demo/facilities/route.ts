import { FACILITIES } from '@/data/facilities'

export async function GET() {
  return Response.json(FACILITIES)
}
