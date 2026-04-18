import { router } from 'expo-router'
import { Platform } from 'react-native'

export function goTo(path: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.location.assign(path)
    return
  }
  router.replace(path as never)
}

export function openRoute(path: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.location.assign(path)
    return
  }
  router.push(path as never)
}
