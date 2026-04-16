# FreeTour AI MVP

Base mobile-first para una app de turismo urbano con geolocalización, rutas y narración en audio.

## Stack

- Expo + React Native + TypeScript
- Expo Router
- Zustand
- Expo Location
- Expo Speech
- React Native Maps
- AsyncStorage

## Qué incluye esta base

- onboarding corto
- home enfocada en modo paseo
- pantalla de modo paseo
- pantalla de planificación de ruta
- pantalla de preferencias
- modelo de POIs y usuario
- motor inicial de proximidad GPS
- motor simple para evitar repeticiones
- TTS local con Expo Speech
- heurística MVP de rutas

## Cómo arrancar

```bash
npm install
npm run start
```

## Typecheck

```bash
npm run typecheck
```

## Ciudad inicial

- Barcelona

## Siguiente paso natural

- conectar backend real y CMS de contenidos
- sustituir TTS local por TTS premium server-side cacheado
- añadir analítica de recorridos y personalización progresiva
