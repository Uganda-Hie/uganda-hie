import { PATIENTS, searchPatients } from '@/data/patients'

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q')
  return Response.json(q ? searchPatients(q) : PATIENTS)
}
