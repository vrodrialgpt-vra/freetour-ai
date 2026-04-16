import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Text } from 'react-native'
import { colors } from '../src/constants/theme'

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 20 : 18, opacity: focused ? 1 : 0.65 }}>{emoji}</Text>
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.inkSoft,
          tabBarStyle: {
            height: 68,
            paddingTop: 8,
            paddingBottom: 10,
            borderTopColor: colors.border,
            backgroundColor: '#FFFFFF',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="walk"
          options={{
            title: 'Paseo',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🎧" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="route-planner"
          options={{
            title: 'Ruta',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ajustes',
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="onboarding"
          options={{ href: null }}
        />
      </Tabs>
    </SafeAreaProvider>
  )
}
