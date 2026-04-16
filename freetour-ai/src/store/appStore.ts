import { create } from 'zustand'
import { defaultPreferences, defaultUserProfile } from '../data/defaults'
import { barcelonaPois } from '../data/pois'
import { buildRoute } from '../services/routePlanner'
import { loadSnapshot, saveSnapshot } from '../services/storage'
import { PlannedRoute, PointOfInterest, UserPreferences, UserProfile } from '../types/domain'

interface AppStore {
  hydrated: boolean
  user: UserProfile
  preferences: UserPreferences
  pois: PointOfInterest[]
  activeRoute: PlannedRoute | null
  currentCityId: string
  init: () => Promise<void>
  completeOnboarding: () => void
  updatePreferences: (patch: Partial<UserPreferences>) => void
  toggleFavourite: (poiId: string) => void
  markVisited: (poiId: string) => void
  setPermissions: (payload: Partial<UserProfile['permissions']>) => void
  createRoute: (minutes: number) => PlannedRoute
}

export const useAppStore = create<AppStore>((set, get) => ({
  hydrated: false,
  user: defaultUserProfile,
  preferences: defaultPreferences,
  pois: barcelonaPois,
  activeRoute: null,
  currentCityId: 'barcelona',
  init: async () => {
    const snapshot = await loadSnapshot()
    if (snapshot) {
      set({
        user: snapshot.user,
        preferences: snapshot.preferences,
        hydrated: true,
      })
      return
    }
    set({ hydrated: true })
  },
  completeOnboarding: () => persist(set, get, {
    user: { ...get().user, onboardingCompleted: true },
  }),
  updatePreferences: (patch) => persist(set, get, {
    preferences: { ...get().preferences, ...patch },
  }),
  toggleFavourite: (poiId) => {
    const current = get().user.favouritePoiIds
    const favouritePoiIds = current.includes(poiId) ? current.filter((id) => id !== poiId) : [...current, poiId]
    persist(set, get, { user: { ...get().user, favouritePoiIds } })
  },
  markVisited: (poiId) => {
    if (get().user.visitedPoiIds.includes(poiId)) return
    persist(set, get, { user: { ...get().user, visitedPoiIds: [...get().user.visitedPoiIds, poiId] } })
  },
  setPermissions: (payload) => persist(set, get, {
    user: { ...get().user, permissions: { ...get().user.permissions, ...payload } },
  }),
  createRoute: (minutes) => {
    const route = buildRoute(get().preferences, minutes)
    set({ activeRoute: route })
    return route
  },
}))

function persist(
  set: (partial: Partial<AppStore>) => void,
  get: () => AppStore,
  partial: Partial<Pick<AppStore, 'user' | 'preferences' | 'activeRoute'>>,
) {
  set(partial as Partial<AppStore>)
  const state = get()
  saveSnapshot({
    user: state.user,
    preferences: state.preferences,
  })
}
