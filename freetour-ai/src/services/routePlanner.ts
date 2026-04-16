import { barcelonaPois } from '../data/pois'
import { PlannedRoute, PlannedStop, PointOfInterest, UserPreferences } from '../types/domain'
import { distanceMeters } from '../utils/geo'

function categoryWeight(poi: PointOfInterest, preferences: UserPreferences) {
  return preferences.weightedCategories[poi.category] ?? 0.5
}

function scorePoi(poi: PointOfInterest, preferences: UserPreferences) {
  const base = poi.priority * 10
  const category = categoryWeight(poi, preferences) * 8
  const foodPenalty = poi.category === 'food' && !preferences.includeFoodStops ? -5 : 0
  const hiddenBoost = preferences.routePreference === 'richer' && poi.hiddenGem ? 6 : 0
  return base + category + foodPenalty + hiddenBoost
}

export function buildRoute(preferences: UserPreferences, availableMinutes: number) {
  const maxStops = Math.min(preferences.maxStops, Math.max(3, Math.floor(availableMinutes / 20)))
  const ranked = [...barcelonaPois]
    .filter((poi) => !preferences.hiddenCategories.includes(poi.category))
    .sort((a, b) => scorePoi(b, preferences) - scorePoi(a, preferences))
    .slice(0, maxStops)

  const ordered = nearestNeighbour(ranked)
  const stops: PlannedStop[] = ordered.map((poi, index) => ({
    poiId: poi.id,
    order: index + 1,
    walkFromPreviousMin: index === 0 ? 0 : Math.max(5, Math.round(distanceMeters(ordered[index - 1].latitude, ordered[index - 1].longitude, poi.latitude, poi.longitude) / 75)),
    visitDurationMin: preferences.depth === 'short' ? 8 : preferences.depth === 'expanded' ? 18 : 12,
  }))

  const totalWalkingMinutes = stops.reduce((acc, stop) => acc + stop.walkFromPreviousMin, 0)
  const totalMinutes = stops.reduce((acc, stop) => acc + stop.walkFromPreviousMin + stop.visitDurationMin, 0)

  const route: PlannedRoute = {
    id: `route-${Date.now()}`,
    cityId: 'barcelona',
    title: availableMinutes <= 120 ? 'Ruta corta por Barcelona' : 'Ruta completa por Barcelona',
    mode: preferences.routeMode,
    totalMinutes,
    totalWalkingMinutes,
    summary:
      preferences.routePreference === 'shorter'
        ? 'Ruta optimizada para ver mucho sin caminar de más.'
        : 'Ruta pensada para mezclar imprescindibles y momentos con historia.',
    stops,
  }

  return route
}

function nearestNeighbour(points: PointOfInterest[]) {
  if (points.length <= 2) return points
  const remaining = [...points]
  const ordered = [remaining.shift()!]

  while (remaining.length) {
    const current = ordered[ordered.length - 1]
    let bestIndex = 0
    let bestDistance = Infinity

    remaining.forEach((candidate, index) => {
      const currentDistance = distanceMeters(current.latitude, current.longitude, candidate.latitude, candidate.longitude)
      if (currentDistance < bestDistance) {
        bestDistance = currentDistance
        bestIndex = index
      }
    })

    ordered.push(remaining.splice(bestIndex, 1)[0])
  }

  return ordered
}
