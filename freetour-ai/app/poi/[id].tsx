import { useLocalSearchParams, router } from 'expo-router'
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { Card, HeroCard, PrimaryButton, Screen, SecondaryButton, Section } from '../../src/components/ui'
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
          <Text style={styles.text}>Puede que este punto no esté cargado todavía o ya no exista.</Text>
          <SecondaryButton label="Volver" onPress={() => router.back()} />
        </Card>
      </Screen>
    )
  }

  const isFavourite = favourites.includes(poi.id)

  return (
    <Screen scroll>
      <HeroCard title={poi.name} subtitle={poi.subtitle} />

      {poi.imageUrl ? <Image source={{ uri: poi.imageUrl }} style={styles.image} resizeMode="cover" /> : null}

      <Section title="Lo importante" subtitle="Corto, útil y pensado para la calle.">
        <Card>
          <Text style={styles.hook}>{poi.hook}</Text>
          <Text style={styles.text}>{poi.shortNarrative}</Text>
          <View style={styles.buttonGap}>
            <PrimaryButton label="Escuchar explicación" onPress={() => speakPoi(poi, preferences)} />
            <SecondaryButton label={isFavourite ? 'Quitar de favoritos' : 'Guardar favorito'} onPress={() => toggleFavourite(poi.id)} />
          </View>
        </Card>
      </Section>

      <Section title="Te viene bien saber" subtitle="Valor práctico, no solo historia.">
        <Card>
          {poi.bestMoment ? <InfoRow label="Mejor momento" value={poi.bestMoment} /> : null}
          {poi.bookingTip ? <InfoRow label="Consejo" value={poi.bookingTip} /> : null}
          <InfoRow label="Duración audio" value={`${Math.round(poi.audioDurationSec / 60)} min aprox.`} />
        </Card>
      </Section>

      {poi.quickFacts?.length ? (
        <Section title="3 cosas curiosas" subtitle="Rápidas de leer, fáciles de recordar.">
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

      <Section title="Sigue explorando" subtitle="Acciones útiles sin fricción.">
        <Card>
          {poi.externalUrl ? (
            <Pressable onPress={() => Linking.openURL(poi.externalUrl!)}>
              <Text style={styles.link}>Abrir más información</Text>
            </Pressable>
          ) : null}
          <Pressable onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${poi.latitude},${poi.longitude}`)}>
            <Text style={styles.link}>Abrir en mapas</Text>
          </Pressable>
        </Card>
      </Section>
    </Screen>
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
  image: { width: '100%', height: 220, borderRadius: 20 },
  title: { fontSize: 20, fontWeight: '800', color: colors.ink },
  hook: { fontSize: 18, fontWeight: '800', color: colors.primaryDark },
  text: { color: colors.inkSoft, lineHeight: 22 },
  buttonGap: { gap: 10 },
  infoRow: { gap: 4 },
  infoLabel: { fontWeight: '800', color: colors.ink },
  factRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  factDot: { fontSize: 20, lineHeight: 20, color: colors.primary },
  link: { color: colors.primary, fontWeight: '800', fontSize: 16 },
})
