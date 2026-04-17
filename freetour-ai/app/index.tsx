import { useMemo, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Card, Field, Pill, Screen, Subtitle, Title, BigButton } from '../src/components/GameUI'
import { starterCards, useGameStore } from '../src/store/gameStore'

export default function HomeScreen() {
  const hydrated = useGameStore((s) => s.hydrated)
  const profile = useGameStore((s) => s.profile)
  const createProfile = useGameStore((s) => s.createProfile)
  const setScreen = useGameStore((s) => s.setScreen)
  const [name, setName] = useState(profile.name)
  const [age, setAge] = useState(profile.age || '6')
  const [starter, setStarter] = useState(profile.starter || starterCards[0].name)
  const [avatarHue, setAvatarHue] = useState(profile.avatarHue)

  const ready = useMemo(() => name.trim().length > 0, [name])

  if (!hydrated) {
    return (
      <Screen>
        <Card color="#7DD3FC">
          <Title>Loading adventure...</Title>
          <Subtitle>Your save crystal is warming up.</Subtitle>
        </Card>
      </Screen>
    )
  }

  if (profile.createdAt) {
    return (
      <Screen>
        <Card color="#6DDC7B">
          <Pill label="Save loaded" color="#6DDC7B" />
          <Title>Welcome back, {profile.name}!</Title>
          <Subtitle>Your team, map, bag and settings were restored from local save storage.</Subtitle>
          <BigButton
            label="Continue game"
            onPress={() => {
              setScreen('world')
              router.replace('/world' as never)
            }}
          />
        </Card>
      </Screen>
    )
  }

  return (
    <Screen>
      <Card color="#FFD84D">
        <Pill label="PixelMon Friends" color="#FFD84D" />
        <Title>A tiny monster adventure for kids</Title>
        <Subtitle>Pick a buddy, walk the map, battle softly, catch new friends and keep your save safe when the app closes.</Subtitle>
      </Card>

      <Card color="#7DD3FC">
        <Text style={styles.label}>Trainer name</Text>
        <Field value={name} onChangeText={setName} placeholder="Type your name" />
        <Text style={styles.label}>Age</Text>
        <Field value={age} onChangeText={setAge} placeholder="6" width={100} />
        <Text style={styles.label}>Color glow</Text>
        <View style={styles.row}>
          {['#7DD3FC', '#F9A8D4', '#FCD34D', '#86EFAC'].map((color) => (
            <Pressable key={color} onPress={() => setAvatarHue(color)} style={[styles.colorDot, { backgroundColor: color }, avatarHue === color && styles.colorDotActive]} />
          ))}
        </View>
      </Card>

      <Card color="#FF8A5C">
        <Text style={styles.label}>Choose your first buddy</Text>
        <View style={styles.grid}>
          {starterCards.map((card) => (
            <Pressable key={card.name} onPress={() => setStarter(card.name)} style={[styles.starterCard, starter === card.name && { borderColor: card.color, transform: [{ scale: 1.02 }] }]}>
              <Image source={{ uri: card.sprite }} style={styles.sprite} />
              <Text style={styles.cardName}>{card.name}</Text>
            </Pressable>
          ))}
        </View>
        <BigButton
          label="Start adventure"
          disabled={!ready}
          onPress={() => {
            createProfile({ name: name.trim(), age: age.trim() || '6', starter, avatarHue })
            router.replace('/world' as never)
          }}
          color="#FF8A5C"
        />
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  label: { color: '#ECF2FF', fontWeight: '800', fontSize: 15 },
  row: { flexDirection: 'row', gap: 12 },
  colorDot: { width: 38, height: 38, borderRadius: 999, borderWidth: 3, borderColor: 'transparent' },
  colorDotActive: { borderColor: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  starterCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: 12, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  sprite: { width: 94, height: 94 },
  cardName: { color: '#fff', fontWeight: '900', fontSize: 16 },
})
