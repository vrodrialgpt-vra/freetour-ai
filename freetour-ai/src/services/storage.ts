import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppStateSnapshot } from '../types/domain'

const STORAGE_KEY = 'freetour-ai-state'

export async function loadSnapshot(): Promise<AppStateSnapshot | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export async function saveSnapshot(snapshot: AppStateSnapshot) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
}
