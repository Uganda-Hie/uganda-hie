import { STOCK_ITEMS, generateStockLevels } from '@/data/stock'

export async function GET(request: Request) {
  const facilityId = new URL(request.url).searchParams.get('facilityId')
  return Response.json(facilityId ? generateStockLevels(facilityId) : STOCK_ITEMS)
}
