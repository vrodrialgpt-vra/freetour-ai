import * as Speech from 'expo-speech'
import { PointOfInterest, UserPreferences } from '../types/domain'

let activePoiId: string | null = null

function composeNarration(poi: PointOfInterest, preferences: UserPreferences) {
  if (preferences.depth === 'short') return `${poi.hook} ${poi.shortNarrative}`
  if (preferences.depth === 'expanded' && poi.fullNarrative) {
    return `${poi.hook} ${poi.shortNarrative} ${poi.fullNarrative}`
  }
  return `${poi.hook} ${poi.shortNarrative}`
}

export async function speakPoi(poi: PointOfInterest, preferences: UserPreferences) {
  if (activePoiId === poi.id) return
  if (Speech.isSpeakingAsync) {
    try {
      const speaking = await Speech.isSpeakingAsync()
      if (speaking) Speech.stop()
    } catch {}
  }

  activePoiId = poi.id
  Speech.speak(composeNarration(poi, preferences), {
    language: preferences.language === 'es' ? 'es-ES' : 'en-US',
    rate: preferences.playbackRate,
    onDone: () => {
      activePoiId = null
    },
    onStopped: () => {
      activePoiId = null
    },
  })
}

export function stopNarration() {
  activePoiId = null
  Speech.stop()
}
