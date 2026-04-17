import { StyleSheet, Text } from 'react-native'
import { router } from 'expo-router'
import { Card, Screen, SmallButton, Subtitle, Title } from '../src/components/GameUI'
import { useGameStore } from '../src/store/gameStore'

export default function AdminScreen() {
  const { flags, grantStarterPack, healAll, resetGame, setScreen } = useGameStore((s) => ({
    flags: s.flags,
    grantStarterPack: s.grantStarterPack,
    healAll: s.healAll,
    resetGame: s.resetGame,
    setScreen: s.setScreen,
  }))

  if (!flags.adminUnlocked) {
    return (
      <Screen>
        <Card color="#FF8A5C">
          <Title>Nothing to see here</Title>
          <Subtitle>This cabin is hidden until unlocked from the profile card.</Subtitle>
          <SmallButton label="Back" onPress={() => { setScreen('profile'); router.replace('/profile' as never) }} />
        </Card>
      </Screen>
    )
  }

  return (
    <Screen>
      <Card color="#F9A8D4">
        <Title>Admin cabin</Title>
        <Subtitle>Quick tools for a parent or tester.</Subtitle>
        <Text style={styles.note}>Hidden access is local to the saved profile and survives reloads.</Text>
        <SmallButton label="Give gift pack" onPress={grantStarterPack} color="#FFD84D" textColor="#18223D" />
        <SmallButton label="Heal whole team" onPress={healAll} color="#6DDC7B" textColor="#18223D" />
        <SmallButton label="Reset all save data" onPress={resetGame} color="#FF8A5C" />
        <SmallButton label="Back to map" onPress={() => { setScreen('world'); router.replace('/world' as never) }} color="#5D7CFF" />
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  note: { color: '#EFF4FF', fontWeight: '700', lineHeight: 22 },
})
