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
          <Title>Cargando aventura...</Title>
          <Subtitle>Estamos despertando tu cristal de guardado.</Subtitle>
        </Card>
      </Screen>
    )
  }

  if (profile.createdAt) {
    return (
      <Screen>
        <Card color="#6DDC7B">
          <Pill label="Partida cargada" color="#6DDC7B" />
          <Title>¡Bienvenido de nuevo, {profile.name}!</Title>
          <Subtitle>Tu equipo, mapa, mochila y ajustes se han recuperado del guardado local.</Subtitle>
          <BigButton
            label="Seguir partida"
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
        <Title>Una pequeña aventura de monstruitos</Title>
        <Subtitle>Elige un compañero, recorre el mapa, lucha sin agobios, atrapa nuevos amigos y guarda tu partida al cerrar.</Subtitle>
        <View style={styles.tipRow}>
          <View style={styles.tipBubble}><Text style={styles.tipText}>1. Escribe tu nombre</Text></View>
          <View style={styles.tipBubble}><Text style={styles.tipText}>2. Elige compañero</Text></View>
          <View style={styles.tipBubble}><Text style={styles.tipText}>3. Empieza</Text></View>
        </View>
      </Card>

      <Card color="#7DD3FC">
        <Text style={styles.label}>Nombre</Text>
        <Field value={name} onChangeText={setName} placeholder="Escribe tu nombre" />
        <Text style={styles.label}>Edad</Text>
        <Field value={age} onChangeText={setAge} placeholder="6" width={100} />
        <Text style={styles.label}>Color</Text>
        <View style={styles.row}>
          {['#7DD3FC', '#F9A8D4', '#FCD34D', '#86EFAC'].map((color) => (
            <Pressable key={color} onPress={() => setAvatarHue(color)} style={({ pressed }) => [styles.colorDot, { backgroundColor: color }, avatarHue === color && styles.colorDotActive, pressed && styles.pressedChoice]}>
              {avatarHue === color ? <Text style={styles.choiceCheck}>✓</Text> : null}
            </Pressable>
          ))}
        </View>
      </Card>

      <Card color="#FF8A5C">
        <Text style={styles.label}>Elige tu primer compañero</Text>
        <View style={styles.grid}>
          {starterCards.map((card) => {
            const selected = starter === card.name
            return (
              <Pressable key={card.name} onPress={() => setStarter(card.name)} style={({ pressed }) => [styles.starterCard, selected && { borderColor: card.color, transform: [{ scale: 1.02 }] }, pressed && styles.pressedChoice]}>
                <Image source={{ uri: card.sprite }} style={styles.sprite} />
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={[styles.cardMeta, selected && { color: '#fff' }]}>{selected ? 'Elegido' : 'Toca para elegir'}</Text>
              </Pressable>
            )
          })}
        </View>
        <BigButton
          label="Empezar aventura"
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
  row: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  tipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tipBubble: { backgroundColor: 'rgba(7,17,30,0.14)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  tipText: { color: '#16203A', fontWeight: '800', fontSize: 12 },
  colorDot: { width: 46, height: 46, borderRadius: 999, borderWidth: 3, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  colorDotActive: { borderColor: '#fff' },
  choiceCheck: { color: '#16203A', fontWeight: '900', fontSize: 18 },
  pressedChoice: { opacity: 0.86 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  starterCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: 12, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', gap: 6, minHeight: 164 },
  sprite: { width: 94, height: 94 },
  cardName: { color: '#fff', fontWeight: '900', fontSize: 16 },
  cardMeta: { color: '#D7E4FF', fontWeight: '800', fontSize: 12 },
})
