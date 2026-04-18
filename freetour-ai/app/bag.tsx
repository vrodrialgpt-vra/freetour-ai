import { StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { BottomNav, Card, Pill, Screen, SmallButton, Subtitle, Title } from '../src/components/GameUI'
import { useGameStore } from '../src/store/gameStore'

export default function BagScreen() {
  const { inventory, useItem, setScreen } = useGameStore((s) => ({ inventory: s.inventory, useItem: s.useItem, setScreen: s.setScreen }))

  return (
    <Screen>
      <Card color="#FFD84D">
        <Pill label="Mochila" color="#FFD84D" />
        <Title>Bolsillo mágico</Title>
        <Subtitle>Usa bayas en combate, o pociones para curar a todo el equipo.</Subtitle>
      </Card>

      <Card color="#6DDC7B">
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>Baya</Text>
          <Text style={styles.itemText}>Cura rápida para el compañero activo.</Text>
          <SmallButton label={`Usar ahora (${inventory.berry})`} onPress={() => useItem('berry')} color="#6DDC7B" textColor="#102038" />
        </View>
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>Bola chispa</Text>
          <Text style={styles.itemText}>Atrapa un amigo salvaje durante el combate.</Text>
          <Text style={styles.count}>Tienes: {inventory['spark-ball']}</Text>
        </View>
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>Poción grande</Text>
          <Text style={styles.itemText}>Cura a todo el equipo.</Text>
          <SmallButton label={`Curar equipo (${inventory['big-potion']})`} onPress={() => useItem('big-potion')} color="#61B7FF" />
        </View>
      </Card>

      <BottomNav
        active="bag"
        items={[
          { key: 'world', label: 'Mapa', onPress: () => { setScreen('world'); router.replace('/world' as never) } },
          { key: 'battle', label: 'Combate', disabled: inventory['spark-ball'] <= 0 && inventory.berry <= 0, onPress: () => { setScreen('battle'); router.replace('/battle' as never) } },
          { key: 'team', label: 'Equipo', onPress: () => { setScreen('team'); router.replace('/team' as never) } },
          { key: 'bag', label: 'Mochila', onPress: () => {} },
          { key: 'profile', label: 'Perfil', onPress: () => { setScreen('profile'); router.replace('/profile' as never) } },
        ]}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  itemCard: { gap: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 12 },
  itemTitle: { color: '#fff', fontWeight: '900', fontSize: 18 },
  itemText: { color: '#D6E3FF', fontWeight: '700' },
  count: { color: '#FFD84D', fontWeight: '900' },
})
