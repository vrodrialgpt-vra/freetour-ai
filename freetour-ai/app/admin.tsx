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
          <Title>Aquí no hay nada</Title>
          <Subtitle>Esta cabina está oculta hasta desbloquearla desde el perfil.</Subtitle>
          <SmallButton label="Volver" onPress={() => { setScreen('profile'); router.replace('/profile' as never) }} />
        </Card>
      </Screen>
    )
  }

  return (
    <Screen>
      <Card color="#F9A8D4">
        <Title>Cabina admin</Title>
        <Subtitle>Herramientas rápidas para probar o ayudar.</Subtitle>
        <Text style={styles.note}>El acceso oculto es local al perfil guardado y sobrevive al recargar.</Text>
        <SmallButton label="Dar pack regalo" onPress={grantStarterPack} color="#FFD84D" textColor="#18223D" />
        <SmallButton label="Curar equipo" onPress={healAll} color="#6DDC7B" textColor="#18223D" />
        <SmallButton label="Borrar partida" onPress={resetGame} color="#FF8A5C" />
        <SmallButton label="Volver al mapa" onPress={() => { setScreen('world'); router.replace('/world' as never) }} color="#5D7CFF" />
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  note: { color: '#EFF4FF', fontWeight: '700', lineHeight: 22 },
})
