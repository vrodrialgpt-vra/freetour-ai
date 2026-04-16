import { useEffect, useMemo, useRef, useState } from 'react'
import * as Haptics from 'expo-haptics'
import * as Location from 'expo-location'
import { barcelonaPois } from '../data/pois'
import { speakPoi, stopNarration } from '../services/audio'
import { findNearbyPois, shouldTriggerPoi } from '../services/proximity'
import { useAppStore } from '../store/appStore'
import { NearbyMatch } from '../types/domain'

export function useWalkingGuide(active: boolean) {
  const preferences = useAppStore((state) => state.preferences)
  const markVisited = useAppStore((state) => state.markVisited)
  const [nearby, setNearby] = useState<NearbyMatch[]>([])
  const [activePoiId, setActivePoiId] = useState<string | null>(null)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const watchRef = useRef<Location.LocationSubscription | null>(null)

  const leadPoi = useMemo(() => nearby[0]?.poi ?? null, [nearby])

  useEffect(() => {
    if (!active) {
      watchRef.current?.remove()
      stopNarration()
      setActivePoiId(null)
      return
    }

    let mounted = true

    async function start() {
      const permission = await Location.requestForegroundPermissionsAsync()
      if (permission.status !== 'granted') {
        setPermissionError('Necesitamos tu ubicación para activar el modo paseo.')
        return
      }

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 20,
          timeInterval: preferences.updateFrequencyMs,
        },
        async (event) => {
          if (!mounted) return
          const matches = findNearbyPois(event.coords.latitude, event.coords.longitude, barcelonaPois, preferences)
          setNearby(matches)
          const top = matches[0]
          if (!top) return

          const allowed = shouldTriggerPoi(top.poi.id, event.coords.speed ?? null, top.confidence, preferences)
          if (!allowed) return

          if (preferences.vibrateBeforeNarration) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          }

          if (preferences.audioMode === 'auto') {
            setActivePoiId(top.poi.id)
            markVisited(top.poi.id)
            await speakPoi(top.poi, preferences)
          }
        },
      )
    }

    start()

    return () => {
      mounted = false
      watchRef.current?.remove()
    }
  }, [active, preferences, markVisited])

  return {
    nearby,
    leadPoi,
    activePoiId,
    permissionError,
    replayLead: async () => {
      if (!leadPoi) return
      await speakPoi(leadPoi, preferences)
    },
  }
}
