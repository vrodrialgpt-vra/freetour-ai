import { StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { BottomNav, Card, Pill, Screen, SmallButton, Subtitle, Title } from '../src/components/GameUI'
import { useGameStore } from '../src/store/gameStore'

export default function BagScreen() {
  const { inventory, useItem, setScreen } = useGameStore((s) => ({ inventory: s.inventory, useItem: s.useItem, setScreen: s.setScreen }))

  return (
    <Screen>
      <Card color="#FFD84D">
        <Pill label="Backpack" color="#FFD84D" />
        <Title>Magic pockets</Title>
        <Subtitle>Use berries during battles, or potions anytime to heal the whole squad.</Subtitle>
      </Card>

      <Card color="#6DDC7B">
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>Berry</Text>
          <Text style={styles.itemText}>Quick heal for the active buddy.</Text>
          <SmallButton label={`Use now (${inventory.berry})`} onPress={() => useItem('berry')} color="#6DDC7B" textColor="#102038" />
        </View>
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>Spark Ball</Text>
          <Text style={styles.itemText}>Catch a wild friend during battle.</Text>
          <Text style={styles.count}>Owned: {inventory['spark-ball']}</Text>
        </View>
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>Big Potion</Text>
          <Text style={styles.itemText}>Heals the whole team.</Text>
          <SmallButton label={`Heal team (${inventory['big-potion']})`} onPress={() => useItem('big-potion')} color="#61B7FF" />
        </View>
      </Card>

      <BottomNav
        active="bag"
        items={[
          { key: 'world', label: 'Map', onPress: () => { setScreen('world'); router.replace('/world' as never) } },
          { key: 'battle', label: 'Battle', onPress: () => { setScreen('battle'); router.replace('/battle' as never) } },
          { key: 'team', label: 'Team', onPress: () => { setScreen('team'); router.replace('/team' as never) } },
          { key: 'bag', label: 'Bag', onPress: () => {} },
          { key: 'profile', label: 'Profile', onPress: () => { setScreen('profile'); router.replace('/profile' as never) } },
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
