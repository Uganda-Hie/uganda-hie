import { DISEASES } from '@/types/disease'

export async function GET() {
  return Response.json(DISEASES)
}
