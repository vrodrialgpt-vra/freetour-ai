import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Haptics from 'expo-haptics'
import * as Speech from 'expo-speech'
import { Platform } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { seedByName, starterChoices, typeColors } from '../data/pokemon'
import { Buddy, computeDamage, createBuddy, healParty, levelUp, randomEncounter } from '../lib/game'

export type ItemKey = 'berry' | 'spark-ball' | 'big-potion'
export type ScreenKey = 'home' | 'world' | 'battle' | 'team' | 'bag' | 'profile' | 'admin'

export type Profile = {
  name: string
  age: string
  starter?: string
  avatarHue: string
  createdAt?: string
}

export type BattleState = {
  wild: Buddy
  hero: Buddy
  log: string[]
  result?: 'won' | 'lost' | 'caught' | 'escaped'
}

export type WorldState = {
  x: number
  y: number
  mapSeed: number
  steps: number
  zoneName: string
}

export type Settings = {
  soundOn: boolean
  voiceOn: boolean
  hapticsOn: boolean
}

export type QuestFlags = {
  adminUnlocked: boolean
  championStars: number
}

type GameState = {
  hydrated: boolean
  activeScreen: ScreenKey
  profile: Profile
  settings: Settings
  world: WorldState
  flags: QuestFlags
  inventory: Record<ItemKey, number>
  party: Buddy[]
  collection: Buddy[]
  battle?: BattleState
  lastToast?: string
  setHydrated: (value: boolean) => void
  setScreen: (screen: ScreenKey) => void
  createProfile: (payload: { name: string; age: string; starter: string; avatarHue: string }) => void
  moveHero: (dx: number, dy: number) => void
  startEncounter: () => void
  attackWild: () => void
  useItem: (item: ItemKey) => void
  throwBall: () => void
  fleeBattle: () => void
  healAll: () => void
  renameBuddy: (uuid: string, name: string) => void
  toggleSetting: (key: keyof Settings) => void
  unlockAdmin: () => void
  grantStarterPack: () => void
  resetGame: () => void
}

const initialProfile: Profile = {
  name: '',
  age: '6',
  avatarHue: '#7DD3FC',
}

const initialWorld = (): WorldState => ({
  x: 2,
  y: 2,
  mapSeed: 77,
  steps: 0,
  zoneName: 'Sunny Meadow',
})

const initialState = {
  hydrated: false,
  activeScreen: 'home' as ScreenKey,
  profile: initialProfile,
  settings: { soundOn: true, voiceOn: true, hapticsOn: true },
  world: initialWorld(),
  flags: { adminUnlocked: false, championStars: 0 },
  inventory: { berry: 5, 'spark-ball': 5, 'big-potion': 2 } as Record<ItemKey, number>,
  party: [] as Buddy[],
  collection: [] as Buddy[],
  battle: undefined as BattleState | undefined,
  lastToast: 'Welcome, little explorer!',
}

const say = (text: string, enabled: boolean) => {
  if (!enabled) return
  try {
    Speech.stop()
    Speech.speak(text, { pitch: 1.25, rate: 0.92 })
  } catch {}
}

const webStorage = {
  getItem: async (name: string) => {
    if (typeof localStorage === 'undefined') return null
    return localStorage.getItem(name)
  },
  setItem: async (name: string, value: string) => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(name, value)
  },
  removeItem: async (name: string) => {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(name)
  },
}

const storage = createJSONStorage(() => (Platform.OS === 'web' ? webStorage : AsyncStorage))

const tap = async (enabled: boolean) => {
  if (!enabled) return
  try {
    await Haptics.selectionAsync()
  } catch {}
}

const enemyTurn = (state: GameState) => {
  const battle = state.battle
  if (!battle || battle.result) return {}
  const damage = computeDamage(battle.wild, battle.hero)
  const hero = { ...battle.hero, currentHp: Math.max(0, battle.hero.currentHp - damage) }
  const log = [...battle.log, `${battle.wild.species} bumps ${battle.hero.name} for ${damage}!`]

  if (hero.currentHp <= 0) {
    const faintedUuid = hero.uuid
    const updatedParty = state.party.map((p) => (p.uuid === faintedUuid ? hero : p))
    const nextHero = updatedParty.find((p) => p.currentHp > 0)
    if (!nextHero) {
      return {
        party: updatedParty,
        battle: { ...battle, hero, log: [...log, 'Oh no, your team needs a nap!'], result: 'lost' as const },
        activeScreen: 'battle' as const,
        lastToast: 'The wild buddy won this round.',
      }
    }
    return {
      party: updatedParty,
      battle: { ...battle, hero: nextHero, log: [...log, `${nextHero.name}, you are up!`] },
      activeScreen: 'battle' as const,
    }
  }

  return {
    party: state.party.map((p) => (p.uuid === hero.uuid ? hero : p)),
    battle: { ...battle, hero, log },
    activeScreen: 'battle' as const,
  }
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setHydrated: (value) => set({ hydrated: value }),
      setScreen: (screen) => set({ activeScreen: screen }),
      createProfile: ({ name, age, starter, avatarHue }) => {
        const buddy = createBuddy(starter, 5, starter)
        set({
          profile: { name, age, starter, avatarHue, createdAt: new Date().toISOString() },
          party: [buddy],
          collection: [buddy],
          world: initialWorld(),
          activeScreen: 'world',
          lastToast: `${name} picked ${starter}!`,
        })
        say(`${starter}. Let's explore!`, get().settings.voiceOn)
      },
      moveHero: (dx, dy) => {
        const state = get()
        const x = Math.max(0, Math.min(4, state.world.x + dx))
        const y = Math.max(0, Math.min(4, state.world.y + dy))
        const steps = state.world.steps + 1
        const zones = ['Sunny Meadow', 'Pebble Path', 'Berry Grove', 'Spark Pond', 'Cloud Hill']
        const zoneName = zones[(x + y) % zones.length]
        const shouldEncounter = Math.random() < 0.27
        const updates: Partial<GameState> = {
          world: { ...state.world, x, y, steps, zoneName },
          activeScreen: 'world',
          lastToast: `Step ${steps} in ${zoneName}`,
        }
        set(updates)
        tap(state.settings.hapticsOn)
        if (shouldEncounter && state.party.some((p) => p.currentHp > 0)) {
          get().startEncounter()
        }
      },
      startEncounter: () => {
        const state = get()
        const hero = state.party.find((p) => p.currentHp > 0)
        if (!hero) return
        const wild = randomEncounter(state.world.steps)
        const battle = {
          wild,
          hero,
          log: [`A wild ${wild.species} appears in ${state.world.zoneName}!`],
        }
        set({ battle, activeScreen: 'battle', lastToast: `Wild ${wild.species}!` })
        say(`A wild ${wild.species} appeared!`, state.settings.voiceOn)
      },
      attackWild: () => {
        const state = get()
        const battle = state.battle
        if (!battle || battle.result) return
        const damage = computeDamage(battle.hero, battle.wild, Math.round(Math.random() * 3))
        const wild = { ...battle.wild, currentHp: Math.max(0, battle.wild.currentHp - damage) }
        let log = [...battle.log, `${battle.hero.name} uses a rainbow blast for ${damage}!`]
        if (wild.currentHp <= 0) {
          const gain = 8 + wild.level * 3
          let levelMessage = `${battle.hero.name} gained ${gain} stardust.`
          const party = state.party.map((p) => {
            if (p.uuid !== battle.hero.uuid) return p
            const leveled = levelUp({ ...p, xp: p.xp + gain })
            if (leveled.message) levelMessage = leveled.message
            return leveled.buddy
          })
          const updatedHero = party.find((p) => p.uuid === battle.hero.uuid)!
          set({
            party,
            collection: state.collection.map((p) => (p.uuid === updatedHero.uuid ? updatedHero : p)),
            battle: { ...battle, wild, hero: updatedHero, log: [...log, `${wild.species} is too sleepy to battle.`, levelMessage], result: 'won' },
            flags: { ...state.flags, championStars: state.flags.championStars + 1 },
            lastToast: levelMessage,
          })
          say(levelMessage, state.settings.voiceOn)
          return
        }
        set({ battle: { ...battle, wild, log } })
        set(enemyTurn(get()) as Partial<GameState>)
      },
      useItem: (item) => {
        const state = get()
        if (state.inventory[item] <= 0) return
        if (item === 'berry' && state.battle) {
          const hero = { ...state.battle.hero, currentHp: Math.min(state.battle.hero.maxHp, state.battle.hero.currentHp + 14) }
          set({
            inventory: { ...state.inventory, berry: state.inventory.berry - 1 },
            party: state.party.map((p) => (p.uuid === hero.uuid ? hero : p)),
            battle: { ...state.battle, hero, log: [...state.battle.log, `${hero.name} eats a berry and feels better!`] },
            lastToast: `${hero.name} healed!`,
          })
          set(enemyTurn(get()) as Partial<GameState>)
          return
        }
        if (item === 'big-potion') {
          const party = healParty(state.party)
          set({
            inventory: { ...state.inventory, 'big-potion': state.inventory['big-potion'] - 1 },
            party,
            collection: state.collection.map((c) => party.find((p) => p.uuid === c.uuid) || c),
            battle: state.battle ? { ...state.battle, hero: party.find((p) => p.uuid === state.battle?.hero.uuid) || party[0], log: [...state.battle.log, 'The whole team feels sparkly fresh!'] } : undefined,
            lastToast: 'Team fully healed!',
          })
          return
        }
      },
      throwBall: () => {
        const state = get()
        const battle = state.battle
        if (!battle || battle.result || state.inventory['spark-ball'] <= 0) return
        const hpFactor = 1 - battle.wild.currentHp / battle.wild.maxHp
        const chance = 0.35 + hpFactor * 0.45
        const success = Math.random() < chance
        const inventory = { ...state.inventory, 'spark-ball': state.inventory['spark-ball'] - 1 }
        if (success) {
          const caught = { ...battle.wild, uuid: `${battle.wild.uuid}-caught`, xp: 0 }
          set({
            inventory,
            party: state.party.length < 4 ? [...state.party, caught] : state.party,
            collection: [...state.collection, caught],
            battle: { ...battle, log: [...battle.log, `Click, flash, hooray! ${battle.wild.species} joined your team!`], result: 'caught' },
            lastToast: `${battle.wild.species} was caught!`,
          })
          say(`${battle.wild.species} is your new friend!`, state.settings.voiceOn)
          return
        }
        set({
          inventory,
          battle: { ...battle, log: [...battle.log, 'Oh! The spark ball popped open.'] },
          lastToast: 'Almost caught it!',
        })
        set(enemyTurn(get()) as Partial<GameState>)
      },
      fleeBattle: () => {
        const state = get()
        if (!state.battle) return
        set({
          battle: { ...state.battle, result: 'escaped', log: [...state.battle.log, 'You dashed away safely!'] },
          activeScreen: 'world',
          lastToast: 'Escaped safely.',
        })
      },
      healAll: () => {
        const state = get()
        const party = healParty(state.party)
        set({ party, collection: state.collection.map((c) => party.find((p) => p.uuid === c.uuid) || c), lastToast: 'All buddies healed!' })
      },
      renameBuddy: (uuid, name) => {
        const rename = (list: Buddy[]) => list.map((p) => (p.uuid === uuid ? { ...p, name: name.trim() || p.species } : p))
        set((state) => ({ party: rename(state.party), collection: rename(state.collection), lastToast: 'Buddy renamed!' }))
      },
      toggleSetting: (key) => set((state) => ({ settings: { ...state.settings, [key]: !state.settings[key] } })),
      unlockAdmin: () => set((state) => ({ flags: { ...state.flags, adminUnlocked: true }, lastToast: 'Admin cabin unlocked.' })),
      grantStarterPack: () => set((state) => ({ inventory: { berry: state.inventory.berry + 3, 'spark-ball': state.inventory['spark-ball'] + 5, 'big-potion': state.inventory['big-potion'] + 2 }, lastToast: 'Admin gift pack delivered!' })),
      resetGame: () => set({ ...initialState, hydrated: true, lastToast: 'New adventure ready!', profile: { ...initialProfile } }),
    }),
    {
      name: 'pixel-mon-save-v1',
      storage,
      partialize: (state) => ({
        activeScreen: state.activeScreen,
        profile: state.profile,
        settings: state.settings,
        world: state.world,
        flags: state.flags,
        inventory: state.inventory,
        party: state.party,
        collection: state.collection,
        battle: state.battle,
        lastToast: state.lastToast,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Failed to hydrate save storage', error)
        }
        state?.setHydrated(true)
      },
    },
  ),
)

export const starterCards = starterChoices.map((name) => ({
  name,
  color: typeColors[seedByName[name].type],
  sprite: seedByName[name].sprite,
}))
