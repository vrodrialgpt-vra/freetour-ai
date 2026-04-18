import { StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { BottomNav, Card, MonsterArt, Pill, Screen, SmallButton, StatBar, Subtitle, Title } from '../src/components/GameUI'
import { typeColors } from '../src/data/pokemon'
import { spriteForSpecies } from '../src/lib/pokedex'
import { useGameStore } from '../src/store/gameStore'

export default function BattleScreen() {
  const { battle, inventory, attackWild, throwBall, useItem, fleeBattle, setScreen } = useGameStore((s) => ({
    battle: s.battle,
    inventory: s.inventory,
    attackWild: s.attackWild,
    throwBall: s.throwBall,
    useItem: s.useItem,
    fleeBattle: s.fleeBattle,
    setScreen: s.setScreen,
  }))

  if (!battle) {
    return (
      <Screen>
        <Card color="#FFD84D">
          <Title>No hay combate ahora</Title>
          <Subtitle>Muévete por el mapa para encontrar un rival salvaje.</Subtitle>
          <SmallButton label="Volver al mapa" onPress={() => { setScreen('world'); router.replace('/world' as never) }} color="#FFD84D" textColor="#16203A" />
        </Card>
      </Screen>
    )
  }

  return (
    <Screen>
      <Card color={typeColors[battle.wild.type]}>
        <Pill label={battle.result ? `Combate ${battle.result}` : 'Encuentro salvaje'} color={typeColors[battle.wild.type]} />
        <Title>{battle.wild.species}</Title>
        <View style={styles.row}>
          <MonsterArt uri={spriteForSpecies(battle.wild.species)} label={battle.wild.species} size={112} accent={typeColors[battle.wild.type]} />
          <View style={styles.info}>
            <Text style={styles.meta}>Nv {battle.wild.level} · {battle.wild.type}</Text>
            <StatBar value={battle.wild.currentHp} max={battle.wild.maxHp} color={typeColors[battle.wild.type]} />
            <Text style={styles.hp}>{battle.wild.currentHp}/{battle.wild.maxHp} HP</Text>
          </View>
        </View>
      </Card>

      <Card color={typeColors[battle.hero.type]}>
        <Title>{battle.hero.name}</Title>
        <View style={styles.row}>
          <MonsterArt uri={spriteForSpecies(battle.hero.species)} label={battle.hero.species} size={96} accent={typeColors[battle.hero.type]} />
          <View style={styles.info}>
            <Text style={styles.meta}>Nv {battle.hero.level} · {battle.hero.species}</Text>
            <StatBar value={battle.hero.currentHp} max={battle.hero.maxHp} color={typeColors[battle.hero.type]} />
            <Text style={styles.hp}>{battle.hero.currentHp}/{battle.hero.maxHp} HP</Text>
          </View>
        </View>
      </Card>

      <Card color="#F9A8D4">
        <Text style={styles.logTitle}>Registro de combate</Text>
        {battle.log.slice(-5).map((entry, index) => (
          <Text key={`${entry}-${index}`} style={styles.logLine}>• {entry}</Text>
        ))}
      </Card>

      <Card color="#61B7FF">
        <View style={styles.actions}>
          <SmallButton label="Golpe arcoíris" onPress={attackWild} color="#5D7CFF" />
          <SmallButton label={`Baya (${inventory.berry})`} onPress={() => useItem('berry')} color="#6DDC7B" textColor="#11203B" />
          <SmallButton label={`Bola chispa (${inventory['spark-ball']})`} onPress={throwBall} color="#FFD84D" textColor="#16203A" />
          <SmallButton label="Huir al mapa" onPress={fleeBattle} color="#FF8A5C" />
        </View>
      </Card>

      <BottomNav
        active="battle"
        items={[
          { key: 'world', label: 'Mapa', onPress: () => { setScreen('world'); router.replace('/world' as never) } },
          { key: 'battle', label: 'Combate', onPress: () => {} },
          { key: 'team', label: 'Equipo', onPress: () => { setScreen('team'); router.replace('/team' as never) } },
          { key: 'bag', label: 'Mochila', onPress: () => { setScreen('bag'); router.replace('/bag' as never) } },
          { key: 'profile', label: 'Perfil', onPress: () => { setScreen('profile'); router.replace('/profile' as never) } },
        ]}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  info: { flex: 1, gap: 6 },
  wildSprite: { width: 112, height: 112 },
  heroSprite: { width: 96, height: 96 },
  meta: { color: '#D9E6FF', fontWeight: '800' },
  hp: { color: '#fff', fontWeight: '800' },
  logTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  logLine: { color: '#EEF3FF', lineHeight: 22, fontWeight: '700' },
  actions: { gap: 10 },
})
