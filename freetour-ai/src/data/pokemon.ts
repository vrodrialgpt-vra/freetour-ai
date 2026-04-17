export type ElementType = 'grass' | 'fire' | 'water' | 'electric' | 'normal'

export type PokemonSeed = {
  id: number
  name: string
  type: ElementType
  evolvesTo?: string
  evolvesLevel?: number
  baseHp: number
  baseAttack: number
  sprite: string
  cry: string
}

const art = (id: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

export const pokemonSeeds: PokemonSeed[] = [
  { id: 1, name: 'Bulbasaur', type: 'grass', evolvesTo: 'Ivysaur', evolvesLevel: 8, baseHp: 24, baseAttack: 8, sprite: art(1), cry: 'bulba!' },
  { id: 2, name: 'Ivysaur', type: 'grass', baseHp: 34, baseAttack: 12, sprite: art(2), cry: 'ivy!' },
  { id: 4, name: 'Charmander', type: 'fire', evolvesTo: 'Charmeleon', evolvesLevel: 8, baseHp: 22, baseAttack: 9, sprite: art(4), cry: 'char!' },
  { id: 5, name: 'Charmeleon', type: 'fire', baseHp: 32, baseAttack: 13, sprite: art(5), cry: 'meleon!' },
  { id: 7, name: 'Squirtle', type: 'water', evolvesTo: 'Wartortle', evolvesLevel: 8, baseHp: 25, baseAttack: 8, sprite: art(7), cry: 'squirt!' },
  { id: 8, name: 'Wartortle', type: 'water', baseHp: 35, baseAttack: 12, sprite: art(8), cry: 'tortle!' },
  { id: 16, name: 'Pidgey', type: 'normal', evolvesTo: 'Pidgeotto', evolvesLevel: 7, baseHp: 20, baseAttack: 7, sprite: art(16), cry: 'pidgey!' },
  { id: 17, name: 'Pidgeotto', type: 'normal', baseHp: 30, baseAttack: 11, sprite: art(17), cry: 'otto!' },
  { id: 19, name: 'Rattata', type: 'normal', evolvesTo: 'Raticate', evolvesLevel: 7, baseHp: 18, baseAttack: 9, sprite: art(19), cry: 'ratta!' },
  { id: 20, name: 'Raticate', type: 'normal', baseHp: 28, baseAttack: 13, sprite: art(20), cry: 'cate!' },
  { id: 25, name: 'Pikachu', type: 'electric', baseHp: 21, baseAttack: 10, sprite: art(25), cry: 'pika pika!' },
  { id: 52, name: 'Meowth', type: 'normal', baseHp: 21, baseAttack: 8, sprite: art(52), cry: 'meowth!' },
  { id: 60, name: 'Poliwag', type: 'water', evolvesTo: 'Poliwhirl', evolvesLevel: 7, baseHp: 22, baseAttack: 8, sprite: art(60), cry: 'poli!' },
  { id: 61, name: 'Poliwhirl', type: 'water', baseHp: 32, baseAttack: 11, sprite: art(61), cry: 'whirl!' },
  { id: 69, name: 'Bellsprout', type: 'grass', evolvesTo: 'Weepinbell', evolvesLevel: 7, baseHp: 20, baseAttack: 9, sprite: art(69), cry: 'sprout!' },
  { id: 70, name: 'Weepinbell', type: 'grass', baseHp: 31, baseAttack: 12, sprite: art(70), cry: 'bell!' },
]

export const starterChoices = ['Bulbasaur', 'Charmander', 'Squirtle', 'Pikachu']

export const typeColors: Record<ElementType, string> = {
  grass: '#6DDC7B',
  fire: '#FF8A5C',
  water: '#61B7FF',
  electric: '#FFD84D',
  normal: '#D6CFC3',
}

export const effectiveness: Record<ElementType, Partial<Record<ElementType, number>>> = {
  grass: { water: 1.6, fire: 0.65, grass: 0.8 },
  fire: { grass: 1.6, water: 0.65, fire: 0.8 },
  water: { fire: 1.6, grass: 0.65, water: 0.8 },
  electric: { water: 1.6, grass: 0.75, electric: 0.8 },
  normal: {},
}

export const seedByName = Object.fromEntries(pokemonSeeds.map((p) => [p.name, p]))
