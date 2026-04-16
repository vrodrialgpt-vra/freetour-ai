import { PointOfInterest, NearbyMatch, UserPreferences } from '../types/domain'
import { distanceMeters } from '../utils/geo'

const triggerMemory = new Map<string, number>()

function confidenceFor(distance: number, radius: number) {
  return Math.max(0, Math.min(1, 1 - distance / Math.max(radius, 1)))
}

export function findNearbyPois(
  latitude: number,
  longitude: number,
  pois: PointOfInterest[],
  preferences: UserPreferences,
): NearbyMatch[] {
  return pois
    .map((poi) => {
      const distance = distanceMeters(latitude, longitude, poi.latitude, poi.longitude)
      const radius = Math.min(Math.max(preferences.activationRadiusMeters, 60), poi.activationRadius + 80)
      return {
        poi,
        distanceMeters: distance,
        confidence: confidenceFor(distance, radius),
        radius,
      }
    })
    .filter((item) => item.distanceMeters <= item.radius)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .map(({ radius, ...match }) => match)
}

export function shouldTriggerPoi(
  poiId: string,
  speedMps: number | null,
  confidence: number,
  preferences: UserPreferences,
) {
  if (preferences.suppressWhileFast && speedMps !== null && speedMps > 2.3) return false
  if (preferences.onlyWhenWalking && speedMps !== null && speedMps < 0.2) return false

  const threshold =
    preferences.detectionSensitivity === 'strict'
      ? 0.62
      : preferences.detectionSensitivity === 'flexible'
        ? 0.28
        : 0.42

  if (confidence < threshold) return false

  const lastTrigger = triggerMemory.get(poiId)
  const now = Date.now()
  if (preferences.avoidRepeats && lastTrigger && now - lastTrigger < 1000 * 60 * 20) return false

  triggerMemory.set(poiId, now)
  return true
}
