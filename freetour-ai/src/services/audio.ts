import * as Speech from 'expo-speech'
import { PointOfInterest, UserPreferences } from '../types/domain'

let activePoiId: string | null = null

function styleLead(preferences: UserPreferences) {
  const map: Record<string, string> = {
    dynamic: 'Te pongo rápido en contexto.',
    classic: 'Vale la pena mirarlo con algo de calma.',
    family: 'Es una parada fácil de disfrutar y de explicar en voz alta.',
    curious: 'Aquí hay más capas de las que parece a primera vista.',
    premium: 'Este es uno de esos lugares que ganan mucho cuando sabes qué estás viendo.',
    brief: 'Voy al grano.',
  }
  return map[preferences.narrativeStyle] ?? 'Te cuento lo importante.'
}

function composeNarration(poi: PointOfInterest, preferences: UserPreferences) {
  const intro = `${styleLead(preferences)} ${poi.hook}`
  const practical = [poi.bestMoment ? `Mejor momento para disfrutarlo: ${poi.bestMoment}.` : '', poi.bookingTip ? `Consejo práctico: ${poi.bookingTip}.` : '']
    .filter(Boolean)
    .join(' ')
  const facts = poi.quickFacts?.map((fact) => `${fact}.`).join(' ') ?? ''

  if (preferences.depth === 'short') {
    return `${intro} ${poi.shortNarrative}`.trim()
  }

  if (preferences.depth === 'expanded') {
    return `${intro} ${poi.shortNarrative} ${poi.fullNarrative ?? ''} ${practical} ${facts}`.replace(/\s+/g, ' ').trim()
  }

  return `${intro} ${poi.shortNarrative} ${poi.fullNarrative ?? ''} ${practical}`.replace(/\s+/g, ' ').trim()
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
    rate: Math.min(preferences.playbackRate, 0.98),
    pitch: 1.0,
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
