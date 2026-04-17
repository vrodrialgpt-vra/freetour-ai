# PixelMon Friends

Child-friendly mobile game MVP inspired by classic monster-catching adventures, built with Expo + React Native.

## What it includes

- profile creation with starter choice
- overworld 5x5 tile map exploration
- random encounters
- turn-based battles with simple type effectiveness
- capture flow with spark balls
- inventory with berries and team potion
- leveling and first evolution tier
- multiple screens: home, map, battle, team, bag, profile, hidden admin
- sound/voice/haptics toggles
- robust local persistence with Zustand + AsyncStorage
- web export path for fast publishing
- first-gen Pokémon-inspired data using public PokeAPI artwork URLs

## Persistence

Save data is stored in local device storage under `pixel-mon-save-v1` and restores on app reopen/reload:

- profile
- team and collection
- inventory
- map position and steps
- battle state
- settings
- admin unlock flag

## Run locally

```bash
npm install
npm run start
```

## Web build

```bash
npm run export:web
```

The static site is emitted to `dist/` and can be deployed to Vercel or any static host.
