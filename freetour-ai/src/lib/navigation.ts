import { router } from 'expo-router'

export function goTo(path: string) {
  router.replace(path as never)
}

export function openRoute(path: string) {
  router.push(path as never)
}
