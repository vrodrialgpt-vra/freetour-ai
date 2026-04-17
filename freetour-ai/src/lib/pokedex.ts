import { seedByName } from '../data/pokemon'

export const spriteForSpecies = (species: string) => seedByName[species]?.sprite || seedByName.Bulbasaur.sprite
