import { DISTRICTS } from '@/data/districts'

export async function GET() {
  return Response.json(DISTRICTS)
}
