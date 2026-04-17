import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Text } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from '../src/constants/theme'

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: focused ? colors.primary : colors.inkMuted,
        fontWeight: focused ? '800' : '700',
      }}
    >
      {label}
    </Text>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.inkMuted,
          tabBarStyle: {
            height: 76,
            paddingTop: 10,
            paddingBottom: 14,
            borderTopColor: colors.border,
            backgroundColor: '#120F0D',
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Descubrir',
            tabBarIcon: ({ focused }) => <TabIcon label="Discover" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="walk"
          options={{
            title: 'Paseo',
            tabBarIcon: ({ focused }) => <TabIcon label="Walk" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="route-planner"
          options={{
            title: 'Ruta',
            tabBarIcon: ({ focused }) => <TabIcon label="Route" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ focused }) => <TabIcon label="Style" focused={focused} />,
          }}
        />
        <Tabs.Screen name="onboarding" options={{ href: null }} />
        <Tabs.Screen name="poi" options={{ href: null }} />
      </Tabs>
    </SafeAreaProvider>
  )
}
