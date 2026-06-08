import { CLAIMS, getClaimsByStatus } from '@/data/claims'
import type { Claim } from '@/types/claim'

export async function GET(request: Request) {
  const status = new URL(request.url).searchParams.get('status')
  return Response.json(status ? getClaimsByStatus(status as Claim['status']) : CLAIMS)
}
