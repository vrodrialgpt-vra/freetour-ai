import { effectiveness, seedByName, starterChoices } from '../data/pokemon'

export type Buddy = {
  uuid: string
  name: string
  species: string
  level: number
  xp: number
  currentHp: number
  maxHp: number
  attack: number
  type: keyof typeof effectiveness
}

export const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`

export function createBuddy(species: string, level = 5, nickname?: string): Buddy {
  const seed = seedByName[species]
  const maxHp = seed.baseHp + level * 4
  return {
    uuid: uid(),
    name: nickname || species,
    species,
    level,
    xp: 0,
    currentHp: maxHp,
    maxHp,
    attack: seed.baseAttack + level * 2,
    type: seed.type,
  }
}

export function chooseStarter() {
  return starterChoices[Math.floor(Math.random() * starterChoices.length)]
}

export function randomEncounter(stepCount: number) {
  const pool = ['Pidgey', 'Rattata', 'Bellsprout', 'Poliwag', 'Meowth', 'Pikachu']
  const luckyPool = ['Bulbasaur', 'Charmander', 'Squirtle']
  const species = Math.random() < Math.min(0.08 + stepCount * 0.002, 0.18)
    ? luckyPool[Math.floor(Math.random() * luckyPool.length)]
    : pool[Math.floor(Math.random() * pool.length)]
  return createBuddy(species, 3 + Math.floor(Math.random() * 4))
}

export function typeMultiplier(attacker: Buddy, defender: Buddy) {
  return effectiveness[attacker.type]?.[defender.type] ?? 1
}

export function computeDamage(attacker: Buddy, defender: Buddy, boost = 0) {
  const base = attacker.attack + Math.floor(attacker.level * 1.5) + boost
  const scaled = Math.round(base * typeMultiplier(attacker, defender))
  return Math.max(4, scaled)
}

export function xpToNext(level: number) {
  return 12 + level * 6
}

export function healParty<T extends Buddy>(party: T[]) {
  return party.map((p) => ({ ...p, currentHp: p.maxHp }))
}

export function levelUp(buddy: Buddy) {
  let leveled = { ...buddy }
  let message = ''
  while (leveled.xp >= xpToNext(leveled.level)) {
    leveled = {
      ...leveled,
      xp: leveled.xp - xpToNext(leveled.level),
      level: leveled.level + 1,
      maxHp: leveled.maxHp + 5,
      attack: leveled.attack + 2,
      currentHp: leveled.maxHp + 5,
    }
    message = `${leveled.name} grew to level ${leveled.level}!`
    const next = seedByName[leveled.species].evolvesTo
    const at = seedByName[leveled.species].evolvesLevel
    if (next && at && leveled.level >= at) {
      const evo = seedByName[next]
      leveled = {
        ...leveled,
        species: next,
        type: evo.type,
        maxHp: evo.baseHp + leveled.level * 4,
        attack: evo.baseAttack + leveled.level * 2,
      }
      leveled.currentHp = leveled.maxHp
      message += ` ${buddy.name} evolved into ${next}!`
    }
  }
  return { buddy: leveled, message }
}
