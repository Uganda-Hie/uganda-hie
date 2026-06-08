// ─────────────────────────────────────────────────────────────────────────
// Maps features in public/uganda-districts.geojson to our district IDs.
//
// IMPORTANT — data limitation:
// The geoBoundaries Uganda file is ADM2, which for Uganda is *counties*
// (149 of them: Aswa, Ayivu, Erute, Bungokho …), NOT the modern districts in
// src/data/districts.ts. Only ~10 county names exactly match our districts,
// and counties are SMALLER than districts (e.g. Wakiso = Busiro + Kyadondo +
// Busujju), so a polygon choropleth keyed on this map will be sparse and
// only partially representative.
//
// For an accurate national map we recommend rendering this GeoJSON as a
// neutral base outline and overlaying our 46 districts as centroid markers
// (District.centroid) coloured by severity — no name-matching required.
//
// The map below contains only HIGH-CONFIDENCE exact matches. Unmatched
// features resolve to null (rendered gray), which is expected.
// ─────────────────────────────────────────────────────────────────────────

/** Property key on each GeoJSON feature that holds the (county) name. */
export const GEOJSON_NAME_KEY = 'shapeName'

/**
 * GeoJSON feature name -> our district ID (src/data/districts.ts), or null.
 * Only exact, geographically-correct matches are included; everything else
 * is intentionally absent (treated as null by getDistrictIdFromFeature).
 */
export const DISTRICT_NAME_MAP: Record<string, string | null> = {
  Kampala: 'kampala',
  Mukono: 'mukono',
  Tororo: 'tororo',
  Soroti: 'soroti',
  Kumi: 'kumi',
  Pallisa: 'pallisa',
  Budaka: 'budaka',
  Butebo: 'butebo',
  Moroto: 'moroto',
  Nwoya: 'nwoya',
}

/**
 * Resolve the district ID for a GeoJSON feature, or null if unmatched.
 */
export function getDistrictIdFromFeature(feature: unknown): string | null {
  const props =
    feature && typeof feature === 'object'
      ? (feature as { properties?: Record<string, unknown> }).properties
      : undefined
  const name = props?.[GEOJSON_NAME_KEY]
  if (typeof name !== 'string') return null
  return DISTRICT_NAME_MAP[name] ?? null
}
