import { useEffect, useMemo } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { BottomNav, Card, Pill, Screen, SmallButton, StatBar, Subtitle, Title } from '../src/components/GameUI'
import { typeColors } from '../src/data/pokemon'
import { spriteForSpecies } from '../src/lib/pokedex'
import { useGameStore } from '../src/store/gameStore'

const size = 5

export default function WorldScreen() {
  const { profile, world, party, inventory, lastToast, battle, activeScreen, moveHero, setScreen, startEncounter } = useGameStore((s) => ({
    profile: s.profile,
    world: s.world,
    party: s.party,
    inventory: s.inventory,
    lastToast: s.lastToast,
    battle: s.battle,
    activeScreen: s.activeScreen,
    moveHero: s.moveHero,
    setScreen: s.setScreen,
    startEncounter: s.startEncounter,
  }))

  useEffect(() => {
    if (battle && activeScreen === 'battle') {
      router.replace('/battle' as never)
    }
  }, [battle, activeScreen])

  const lead = party[0]
  const tiles = useMemo(() => Array.from({ length: size * size }, (_, i) => ({ x: i % size, y: Math.floor(i / size) })), [])

  return (
    <Screen>
      <Card color={profile.avatarHue}>
        <Pill label={world.zoneName} color={profile.avatarHue} />
        <Title>{profile.name}'s Adventure Map</Title>
        <Subtitle>Tap the arrows to walk. Random encounters can pop up any time in the tall grass.</Subtitle>
        {lead ? (
          <View style={styles.leadRow}>
            <Image source={{ uri: spriteForSpecies(lead.species) }} style={styles.heroSprite} />
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={styles.heroName}>{lead.name}</Text>
              <Text style={styles.heroMeta}>Lv {lead.level} · {lead.species}</Text>
              <StatBar value={lead.currentHp} max={lead.maxHp} color={typeColors[lead.type]} />
            </View>
          </View>
        ) : null}
      </Card>

      <Card color="#61B7FF">
        <View style={styles.map}>
          {tiles.map((tile) => {
            const heroHere = tile.x === world.x && tile.y === world.y
            const grass = (tile.x + tile.y) % 2 === 0
            return (
              <View key={`${tile.x}-${tile.y}`} style={[styles.tile, { backgroundColor: heroHere ? '#FFD84D' : grass ? '#61C280' : '#7EC8FF' }]}>
                <Text style={styles.tileText}>{heroHere ? '🧒' : grass ? '🌿' : '✨'}</Text>
              </View>
            )
          })}
        </View>
        <View style={styles.controls}>
          <Text style={styles.controlsTitle}>Walk around</Text>
          <SmallButton label="⬆ Up" onPress={() => moveHero(0, -1)} />
          <View style={styles.controlRow}>
            <SmallButton label="⬅ Left" onPress={() => moveHero(-1, 0)} />
            <SmallButton label="➡ Right" onPress={() => moveHero(1, 0)} />
          </View>
          <SmallButton label="⬇ Down" onPress={() => moveHero(0, 1)} />
          <SmallButton label="Start a battle now" onPress={startEncounter} color="#FF8A5C" />
        </View>
      </Card>

      <Card color="#F9A8D4">
        <Text style={styles.toast}>{lastToast}</Text>
        <Text style={styles.meta}>Berries: {inventory.berry} · Spark Balls: {inventory['spark-ball']} · Potions: {inventory['big-potion']}</Text>
      </Card>

      <BottomNav
        active="world"
        items={[
          { key: 'world', label: 'Map', onPress: () => { setScreen('world'); router.replace('/world' as never) } },
          { key: 'battle', label: 'Battle', disabled: !battle, onPress: () => { setScreen('battle'); router.replace('/battle' as never) } },
          { key: 'team', label: 'Team', onPress: () => { setScreen('team'); router.replace('/team' as never) } },
          { key: 'bag', label: 'Bag', onPress: () => { setScreen('bag'); router.replace('/bag' as never) } },
          { key: 'profile', label: 'Profile', onPress: () => { setScreen('profile'); router.replace('/profile' as never) } },
        ]}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  leadRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  heroSprite: { width: 92, height: 92 },
  heroName: { color: '#fff', fontSize: 22, fontWeight: '900' },
  heroMeta: { color: '#D7E4FF', fontWeight: '700' },
  map: { width: '100%', aspectRatio: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tile: { width: '18.4%', aspectRatio: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tileText: { fontSize: 22 },
  controls: { gap: 10, alignItems: 'stretch' },
  controlsTitle: { color: '#fff', fontWeight: '900', fontSize: 18, textAlign: 'center' },
  controlRow: { flexDirection: 'row', gap: 10 },
  toast: { color: '#fff', fontWeight: '900', fontSize: 18 },
  meta: { color: '#E6EBFF', fontWeight: '700' },
})
