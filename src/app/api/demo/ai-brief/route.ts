import { generateAIBrief, generateStockAlert, generateOutbreakFlag } from '@/lib/ai-insights'
import type { DiseaseKey } from '@/types/disease'

export async function GET(request: Request) {
  const param = new URL(request.url).searchParams.get('disease')
  const disease = (param ?? 'malaria') as DiseaseKey
  return Response.json({
    brief: generateAIBrief(disease),
    stockAlert: generateStockAlert(disease),
    outbreak: generateOutbreakFlag(disease),
  })
}
