import { useLocalSearchParams, router } from 'expo-router'
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { Card, HeroCard, PoiImage, PrimaryButton, Screen, SecondaryButton, Section } from '../../src/components/ui'
import { colors } from '../../src/constants/theme'
import { speakPoi } from '../../src/services/audio'
import { useAppStore } from '../../src/store/appStore'

export default function PoiDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const poi = useAppStore((state) => state.pois.find((item) => item.id === id))
  const preferences = useAppStore((state) => state.preferences)
  const favourites = useAppStore((state) => state.user.favouritePoiIds)
  const toggleFavourite = useAppStore((state) => state.toggleFavourite)

  if (!poi) {
    return (
      <Screen>
        <Card>
          <Text style={styles.title}>Lugar no encontrado</Text>
          <Text style={styles.text}>Este sitio no está disponible ahora mismo.</Text>
          <SecondaryButton label="Volver" onPress={() => router.back()} />
        </Card>
      </Screen>
    )
  }

  const isFavourite = favourites.includes(poi.id)

  return (
    <Screen scroll>
      <HeroCard title={poi.name} subtitle={poi.subtitle} />
      <PoiImage uri={poi.imageUrl} emoji="📍" height={240} rounded={24} />

      <Section title="Qué merece la pena aquí" subtitle="Rápido de entender y útil de verdad.">
        <Card>
          <Text style={styles.hook}>{poi.hook}</Text>
          <Text style={styles.text}>{poi.shortNarrative}</Text>
          <View style={styles.infoPills}>
            <Pill label={poi.category} />
            <Pill label={poi.familyFriendly ? 'Apto para todos' : 'Mejor para adultos'} />
            <Pill label={`${Math.round(poi.audioDurationSec / 60)} min audio`} />
          </View>
          <View style={styles.buttonGap}>
            <PrimaryButton label="Escuchar explicación" onPress={() => speakPoi(poi, preferences)} />
            <SecondaryButton label={isFavourite ? 'Quitar de guardados' : 'Guardar este sitio'} onPress={() => toggleFavourite(poi.id)} />
          </View>
        </Card>
      </Section>

      <Section title="Consejos prácticos" subtitle="Para usarlo como turista, no como lector de fichas.">
        <Card>
          {poi.bestMoment ? <InfoRow label="Cuándo ir" value={poi.bestMoment} /> : null}
          {poi.bookingTip ? <InfoRow label="Consejo" value={poi.bookingTip} /> : null}
        </Card>
      </Section>

      {poi.quickFacts?.length ? (
        <Section title="Curiosidades rápidas" subtitle="Pequeños detalles que ayudan a recordarlo.">
          <Card>
            {poi.quickFacts.map((fact) => (
              <View key={fact} style={styles.factRow}>
                <Text style={styles.factDot}>•</Text>
                <Text style={styles.text}>{fact}</Text>
              </View>
            ))}
          </Card>
        </Section>
      ) : null}

      <Section title="Abrir fuera" subtitle="Atajos útiles cuando ya estás en la calle.">
        <Card>
          {poi.externalUrl ? (
            <Pressable onPress={() => Linking.openURL(poi.externalUrl!)}>
              <Text style={styles.link}>Más información</Text>
            </Pressable>
          ) : null}
          <Pressable onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${poi.latitude},${poi.longitude}`)}>
            <Text style={styles.link}>Abrir en Google Maps</Text>
          </Pressable>
        </Card>
      </Section>
    </Screen>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.text}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '800', color: colors.ink },
  hook: { fontSize: 19, fontWeight: '900', color: colors.primaryDark, lineHeight: 24 },
  text: { color: colors.inkSoft, lineHeight: 22 },
  infoPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { backgroundColor: colors.cardMuted, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  pillText: { color: colors.primaryDark, fontWeight: '700', textTransform: 'capitalize' },
  buttonGap: { gap: 10 },
  infoRow: { gap: 4 },
  infoLabel: { fontWeight: '800', color: colors.ink },
  factRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  factDot: { fontSize: 20, lineHeight: 20, color: colors.primary },
  link: { color: colors.primary, fontWeight: '800', fontSize: 16 },
})
