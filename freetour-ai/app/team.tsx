import { Image, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { BottomNav, Card, Pill, Screen, SmallButton, StatBar, Title } from '../src/components/GameUI'
import { typeColors } from '../src/data/pokemon'
import { spriteForSpecies } from '../src/lib/pokedex'
import { useGameStore } from '../src/store/gameStore'

export default function TeamScreen() {
  const { party, collection, healAll, setScreen } = useGameStore((s) => ({
    party: s.party,
    collection: s.collection,
    healAll: s.healAll,
    setScreen: s.setScreen,
  }))

  return (
    <Screen>
      <Card color="#6DDC7B">
        <Pill label={`Team ${party.length}/4`} color="#6DDC7B" />
        <Title>Your buddy squad</Title>
        {party.map((buddy) => (
          <View key={buddy.uuid} style={styles.cardRow}>
            <Image source={{ uri: spriteForSpecies(buddy.species) }} style={styles.sprite} />
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={styles.name}>{buddy.name}</Text>
              <Text style={styles.meta}>{buddy.species} · Lv {buddy.level}</Text>
              <StatBar value={buddy.currentHp} max={buddy.maxHp} color={typeColors[buddy.type]} />
            </View>
          </View>
        ))}
        <SmallButton label="Heal everyone" onPress={healAll} color="#6DDC7B" textColor="#102038" />
      </Card>

      <Card color="#FFD84D">
        <Title>Sticker album</Title>
        <View style={styles.album}>
          {collection.map((buddy) => (
            <View key={buddy.uuid} style={styles.albumCard}>
              <Image source={{ uri: spriteForSpecies(buddy.species) }} style={styles.albumSprite} />
              <Text style={styles.albumText}>{buddy.species}</Text>
            </View>
          ))}
        </View>
      </Card>

      <BottomNav
        active="team"
        items={[
          { key: 'world', label: 'Map', onPress: () => { setScreen('world'); router.replace('/world' as never) } },
          { key: 'battle', label: 'Battle', disabled: party.every((p) => p.currentHp <= 0), onPress: () => { setScreen('battle'); router.replace('/battle' as never) } },
          { key: 'team', label: 'Team', onPress: () => {} },
          { key: 'bag', label: 'Bag', onPress: () => { setScreen('bag'); router.replace('/bag' as never) } },
          { key: 'profile', label: 'Profile', onPress: () => { setScreen('profile'); router.replace('/profile' as never) } },
        ]}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  cardRow: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 10 },
  sprite: { width: 74, height: 74 },
  name: { color: '#fff', fontSize: 18, fontWeight: '900' },
  meta: { color: '#D9E5FF', fontWeight: '700' },
  album: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  albumCard: { width: '31%', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 8, alignItems: 'center' },
  albumSprite: { width: 58, height: 58 },
  albumText: { color: '#fff', fontSize: 12, fontWeight: '800', textAlign: 'center' },
})
