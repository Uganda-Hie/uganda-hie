'use client'

import { useEffect, useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import type { FeatureCollection, Geometry, Position } from 'geojson'
import { DISTRICTS, generateDistrictMetrics } from '@/data/districts'
import { getSeverityHex } from '@/lib/severity'
import type { DiseaseKey } from '@/types/disease'
import type { DistrictMetric } from '@/types/district'

interface UgandaMapProps {
  disease: DiseaseKey
  selectedDistrictId?: string | null
  onDistrictHover?: (districtId: string | null, x: number, y: number) => void
  onDistrictClick?: (districtId: string) => void
}

const BASE_FILL = '#f1f5f9'
const BASE_STROKE = '#cbd5e1'
const GEOJSON_URL = '/uganda-districts.geojson'
const WIDTH = 800
const HEIGHT = 600
const PAD = 24

// Marker radius scales with the district's severity score (0–100).
const radiusScale = scaleLinear().domain([0, 100]).range([4, 13]).clamp(true)

type Projector = (coord: Position) => [number, number]

/**
 * Build a planar equirectangular projection fitted to the GeoJSON bounds.
 * Uganda is small and near the equator, so planar lon/lat → x/y (with a
 * uniform aspect-preserving scale) renders accurately — and sidesteps
 * d3-geo's spherical winding pitfalls that collapse this dataset.
 */
function buildProjection(geo: FeatureCollection): Projector {
  let minLon = Infinity,
    maxLon = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity
  const scan = (c: Position[] | Position[][] | Position[][][] | Position): void => {
    if (typeof (c as Position)[0] === 'number') {
      const [lon, lat] = c as Position
      minLon = Math.min(minLon, lon)
      maxLon = Math.max(maxLon, lon)
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
    } else {
      ;(c as Position[][]).forEach(scan)
    }
  }
  geo.features.forEach((f) => f.geometry && scan((f.geometry as { coordinates: Position[] }).coordinates))

  const lonSpan = maxLon - minLon || 1
  const latSpan = maxLat - minLat || 1
  const s = Math.min((WIDTH - 2 * PAD) / lonSpan, (HEIGHT - 2 * PAD) / latSpan)
  const offsetX = (WIDTH - lonSpan * s) / 2
  const offsetY = (HEIGHT - latSpan * s) / 2

  return ([lon, lat]: Position) => [
    offsetX + (lon - minLon) * s,
    offsetY + (maxLat - lat) * s, // flip y (screen grows downward)
  ]
}

function geometryToPath(geometry: Geometry, project: Projector): string {
  const polys: Position[][][] =
    geometry.type === 'Polygon'
      ? [geometry.coordinates]
      : geometry.type === 'MultiPolygon'
        ? geometry.coordinates
        : []
  let d = ''
  for (const poly of polys) {
    for (const ring of poly) {
      ring.forEach((pt, i) => {
        const [x, y] = project(pt)
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      d += 'Z'
    }
  }
  return d
}

export function UgandaMap({
  disease,
  selectedDistrictId,
  onDistrictHover,
  onDistrictClick,
}: UgandaMapProps) {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null)
  useEffect(() => {
    let active = true
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((data) => active && setGeoData(data))
      .catch(() => active && setGeoData(null))
    return () => {
      active = false
    }
  }, [])

  const project = useMemo(
    () => (geoData ? buildProjection(geoData) : null),
    [geoData]
  )

  const basePaths = useMemo(() => {
    if (!geoData || !project) return []
    return geoData.features.map((f) => geometryToPath(f.geometry, project))
  }, [geoData, project])

  const metricByDistrict = useMemo(() => {
    const map: Record<string, DistrictMetric> = {}
    for (const m of generateDistrictMetrics(disease)) map[m.districtId] = m
    return map
  }, [disease])

  const reportingCount = useMemo(
    () =>
      Object.values(metricByDistrict).filter((m) => m.severity !== 'missing')
        .length,
    [metricByDistrict]
  )

  if (!geoData || !project) {
    return (
      <div className="h-[600px] w-full animate-pulse rounded-xl bg-gray-100" />
    )
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl border bg-white">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label="Uganda district severity map"
        >
          {/* Base layer: district outlines */}
          <g style={{ pointerEvents: 'none' }}>
            {basePaths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={BASE_FILL}
                stroke={BASE_STROKE}
                strokeWidth={0.5}
              />
            ))}
          </g>

          {/* District markers: colored by severity, sized by score */}
          <g>
            {DISTRICTS.map((dist) => {
              const metric = metricByDistrict[dist.id]
              if (!metric) return null
              const [cx, cy] = project(dist.centroid)
              const isSelected = dist.id === selectedDistrictId
              const r = radiusScale(metric.severityScore)
              return (
                <circle
                  key={dist.id}
                  cx={cx}
                  cy={cy}
                  r={isSelected ? r + 3 : r}
                  fill={getSeverityHex(metric.severity)}
                  fillOpacity={0.85}
                  stroke={isSelected ? '#1e293b' : '#ffffff'}
                  strokeWidth={isSelected ? 2 : 1}
                  style={{ cursor: 'pointer', transition: 'fill 0.4s ease' }}
                  onMouseEnter={(e) =>
                    onDistrictHover?.(dist.id, e.clientX, e.clientY)
                  }
                  onMouseMove={(e) =>
                    onDistrictHover?.(dist.id, e.clientX, e.clientY)
                  }
                  onMouseLeave={() => onDistrictHover?.(null, 0, 0)}
                  onClick={() => onDistrictClick?.(dist.id)}
                />
              )
            })}
          </g>

          {/* Hotspot bubbles: critical (pulsing) + high districts */}
          <g>
            {DISTRICTS.map((dist) => {
              const metric = metricByDistrict[dist.id]
              if (!metric) return null
              if (metric.severity !== 'critical' && metric.severity !== 'high')
                return null
              const [cx, cy] = project(dist.centroid)
              const isCritical = metric.severity === 'critical'
              return (
                <circle
                  key={`hotspot-${dist.id}`}
                  cx={cx}
                  cy={cy}
                  r={isCritical ? 8 : 6}
                  fill={isCritical ? '#dc2626' : '#f97316'}
                  fillOpacity={0.55}
                  className={isCritical ? 'hotspot-pulse' : undefined}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) =>
                    onDistrictHover?.(dist.id, e.clientX, e.clientY)
                  }
                  onMouseMove={(e) =>
                    onDistrictHover?.(dist.id, e.clientX, e.clientY)
                  }
                  onMouseLeave={() => onDistrictHover?.(null, 0, 0)}
                  onClick={() => onDistrictClick?.(dist.id)}
                />
              )
            })}
          </g>
        </svg>
      </div>

      {/* Footer row */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          <span className="font-medium text-gray-700">
            {reportingCount} / {DISTRICTS.length}
          </span>{' '}
          districts reporting
        </span>
        <span>Hover a district for details</span>
      </div>
    </div>
  )
}
