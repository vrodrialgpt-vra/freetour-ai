export type NarrativeStyle = 'classic' | 'dynamic' | 'family' | 'curious' | 'premium' | 'brief'
export type DepthLevel = 'short' | 'standard' | 'expanded'
export type AudioMode = 'auto' | 'manual'
export type TravelMode = 'walk' | 'mixed'
export type RouteMode = 'improvised' | 'fixed'
export type Pace = 'relaxed' | 'normal' | 'fast'
export type AppTheme = 'light' | 'dark' | 'system'

export type PoiCategory =
  | 'history'
  | 'architecture'
  | 'art'
  | 'curiosity'
  | 'food'
  | 'landmark'
  | 'hidden-gem'
  | 'family'

export interface PointOfInterest {
  id: string
  cityId: string
  name: string
  subtitle: string
  latitude: number
  longitude: number
  category: PoiCategory
  priority: number
  activationRadius: number
  audioDurationSec: number
  hook: string
  shortNarrative: string
  fullNarrative?: string
  imageUrl?: string
  externalUrl?: string
  bookingTip?: string
  bestMoment?: string
  quickFacts?: string[]
  tags: string[]
  familyFriendly: boolean
  hiddenGem?: boolean
}

export interface UserPreferences {
  language: 'es' | 'en'
  narrativeStyle: NarrativeStyle
  depth: DepthLevel
  weightedCategories: Record<PoiCategory, number>
  hiddenCategories: PoiCategory[]
  audioMode: AudioMode
  playbackRate: number
  autoPlayNext: boolean
  showTranscript: boolean
  vibrateBeforeNarration: boolean
  discreetHeadphonesMode: boolean
  activationRadiusMeters: number
  detectionSensitivity: 'strict' | 'balanced' | 'flexible'
  updateFrequencyMs: number
  onlyWhenWalking: boolean
  suppressWhileFast: boolean
  avoidRepeats: boolean
  preferredTravelMode: TravelMode
  routePreference: 'shorter' | 'richer'
  routeMode: RouteMode
  pace: Pace
  maxRouteMinutes: number
  maxStops: number
  autoRecalculateRoute: boolean
  includeFoodStops: boolean
  includeShoppingAreas: boolean
  theme: AppTheme
  fontScale: 'normal' | 'large'
  onboardingMode: 'guided' | 'quick'
  partyMode: 'solo' | 'couple' | 'family' | 'kids'
  highContrast: boolean
  subtitlesAlwaysOn: boolean
  simplifiedNavigation: boolean
  homeCity: string
}

export interface UserProfile {
  id: string
  name?: string
  onboardingCompleted: boolean
  permissions: {
    location: 'unknown' | 'granted' | 'denied'
    audio: 'unknown' | 'granted' | 'denied'
  }
  visitedPoiIds: string[]
  favouritePoiIds: string[]
  completedRouteIds: string[]
  visitedCities: string[]
  pendingPoiIds: string[]
}

export interface PlannedStop {
  poiId: string
  order: number
  walkFromPreviousMin: number
  visitDurationMin: number
}

export interface PlannedRoute {
  id: string
  cityId: string
  title: string
  mode: RouteMode
  totalMinutes: number
  totalWalkingMinutes: number
  summary: string
  stops: PlannedStop[]
}

export interface NearbyMatch {
  poi: PointOfInterest
  distanceMeters: number
  confidence: number
}

export interface AppStateSnapshot {
  user: UserProfile
  preferences: UserPreferences
  activeRoute?: PlannedRoute | null
}
