import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useGameStore } from '../src/store/gameStore'

export default function RootLayout() {
  useEffect(() => {
    useGameStore.persist.rehydrate()
  }, [])
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#101427' },
          animation: 'fade',
        }}
      />
    </SafeAreaProvider>
  )
}
