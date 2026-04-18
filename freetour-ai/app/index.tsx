import { useMemo, useState } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { Card, Field, Pill, Screen, Subtitle, Title, BigButton } from '../src/components/GameUI'
import { goTo } from '../src/lib/navigation'
import { starterCards, useGameStore } from '../src/store/gameStore'

const starterEmoji: Record<string, string> = {
  Bulbasaur: '🌿',
  Charmander: '🔥',
  Squirtle: '💧',
  Pikachu: '⚡',
}

export default function HomeScreen() {
  const hydrated = useGameStore((s) => s.hydrated)
  const profile = useGameStore((s) => s.profile)
  const createProfile = useGameStore((s) => s.createProfile)
  const setScreen = useGameStore((s) => s.setScreen)
  const [name, setName] = useState(profile.name)
  const [age, setAge] = useState(profile.age || '6')
  const [starter, setStarter] = useState(profile.starter || starterCards[0].name)
  const [avatarHue, setAvatarHue] = useState(profile.avatarHue)

  const normalizedName = useMemo(() => name.trim() || 'Entrenador', [name])
  const colorOptions = [
    { value: '#7DD3FC', label: 'Azul' },
    { value: '#F9A8D4', label: 'Rosa' },
    { value: '#FCD34D', label: 'Amarillo' },
    { value: '#86EFAC', label: 'Verde' },
  ]
  const selectedColorLabel = colorOptions.find((option) => option.value === avatarHue)?.label || 'Azul'

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
              goTo('/world')
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
        <Text style={styles.helper}>Color elegido: {selectedColorLabel}</Text>
        <View style={styles.row}>
          {colorOptions.map((option) => (
            Platform.OS === 'web' ? (
              <button key={option.value} onClick={() => setAvatarHue(option.value)} style={{ minWidth: 84, height: 52, borderRadius: 16, border: avatarHue === option.value ? '3px solid white' : '3px solid transparent', backgroundColor: option.value, cursor: 'pointer', fontWeight: 900, color: '#16203A' }}>
                {avatarHue === option.value ? `✓ ${option.label}` : option.label}
              </button>
            ) : (
              <Pressable key={option.value} onPress={() => setAvatarHue(option.value)} style={({ pressed }) => [styles.colorPill, { backgroundColor: option.value }, avatarHue === option.value && styles.colorPillActive, pressed && styles.pressedChoice]}>
                <Text style={styles.colorPillText}>{avatarHue === option.value ? `✓ ${option.label}` : option.label}</Text>
              </Pressable>
            )
          ))}
        </View>
      </Card>

      <Card color="#FF8A5C">
        <Text style={styles.label}>Elige tu primer compañero</Text>
        <View style={styles.grid}>
          {starterCards.map((card) => {
            const selected = starter === card.name
            return Platform.OS === 'web' ? (
              <button key={card.name} onClick={() => setStarter(card.name)} style={{ width: '47%', minHeight: 184, borderRadius: 20, border: `3px solid ${selected ? card.color : 'transparent'}`, background: selected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)', cursor: 'pointer', padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                  <View style={[styles.starterBadge, { borderColor: card.color, backgroundColor: `${card.color}22` }]}>
                    <Text style={[styles.starterBadgeEmoji, { color: card.color }]}>{starterEmoji[card.name] || '✨'}</Text>
                    <Text style={styles.starterBadgeLetter}>{card.name.slice(0, 1)}</Text>
                  </View>
                </div>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={[styles.cardMeta, selected && { color: '#fff' }]}>{selected ? '✓ Elegido' : 'Toca para elegir'}</Text>
              </button>
            ) : (
              <Pressable key={card.name} onPress={() => setStarter(card.name)} style={({ pressed }) => [styles.starterCard, selected && { borderColor: card.color, transform: [{ scale: 1.02 }], backgroundColor: 'rgba(255,255,255,0.18)' }, pressed && styles.pressedChoice]}>
                <View style={[styles.starterBadge, { borderColor: card.color, backgroundColor: `${card.color}22` }]}>
                  <Text style={[styles.starterBadgeEmoji, { color: card.color }]}>{starterEmoji[card.name] || '✨'}</Text>
                  <Text style={styles.starterBadgeLetter}>{card.name.slice(0, 1)}</Text>
                </View>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={[styles.cardMeta, selected && { color: '#fff' }]}>{selected ? '✓ Elegido' : 'Toca para elegir'}</Text>
              </Pressable>
            )
          })}
        </View>
        <BigButton
          label="Empezar aventura"
          onPress={() => {
            createProfile({ name: normalizedName, age: age.trim() || '6', starter, avatarHue })
            goTo('/world')
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
  helper: { color: '#D7E4FF', fontWeight: '700', marginTop: -4 },
  colorPill: { minWidth: 84, minHeight: 52, borderRadius: 16, borderWidth: 3, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  colorPillActive: { borderColor: '#fff' },
  colorPillText: { color: '#16203A', fontWeight: '900', fontSize: 14 },
  pressedChoice: { opacity: 0.86 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  starterCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: 12, alignItems: 'center', borderWidth: 3, borderColor: 'transparent', gap: 8, minHeight: 184 },
  starterBadge: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  starterBadgeEmoji: { fontSize: 34, fontWeight: '900' },
  starterBadgeLetter: { color: '#fff', fontWeight: '900', fontSize: 26, position: 'absolute', bottom: 10, right: 18 },
  cardName: { color: '#fff', fontWeight: '900', fontSize: 16 },
  cardMeta: { color: '#D7E4FF', fontWeight: '800', fontSize: 12 },
})
