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
          <Text style={styles.title}>Place not available</Text>
          <Text style={styles.text}>This recommendation could not be loaded.</Text>
          <SecondaryButton label="Go back" onPress={() => router.back()} />
        </Card>
      </Screen>
    )
  }

  const isFavourite = favourites.includes(poi.id)

  return (
    <Screen scroll>
      <HeroCard title={poi.name} subtitle={poi.subtitle} />
      <PoiImage uri={poi.imageUrl} emoji="◆" height={280} rounded={28} />

      <Section title="Why it matters" subtitle="Presented like a recommendation, not a database entry.">
        <Card>
          <Text style={styles.eyebrow}>{poi.category}</Text>
          <Text style={styles.hook}>{poi.hook}</Text>
          <Text style={styles.text}>{poi.shortNarrative}</Text>
          <View style={styles.buttonGap}>
            <PrimaryButton label="Listen" onPress={() => speakPoi(poi, preferences)} />
            <SecondaryButton label={isFavourite ? 'Remove from saved' : 'Save place'} onPress={() => toggleFavourite(poi.id)} />
          </View>
        </Card>
      </Section>

      <Section title="Practical notes" subtitle="The small details that make a place easier to enjoy.">
        <Card>
          {poi.bestMoment ? <InfoRow label="Best moment" value={poi.bestMoment} /> : null}
          {poi.bookingTip ? <InfoRow label="Booking tip" value={poi.bookingTip} /> : null}
          <InfoRow label="Audio length" value={`${Math.round(poi.audioDurationSec / 60)} min`} />
        </Card>
      </Section>

      {poi.quickFacts?.length ? (
        <Section title="Curated facts" subtitle="Small, memorable details rather than long explanations.">
          <Card>
            {poi.quickFacts.map((fact, index) => (
              <View key={fact} style={styles.factRow}>
                <Text style={styles.factIndex}>0{index + 1}</Text>
                <Text style={styles.text}>{fact}</Text>
              </View>
            ))}
          </Card>
        </Section>
      ) : null}

      <Section title="Open elsewhere" subtitle="Useful handoff when you want to keep moving.">
        <Card>
          {poi.externalUrl ? (
            <Pressable onPress={() => Linking.openURL(poi.externalUrl!)}>
              <Text style={styles.link}>Read more</Text>
            </Pressable>
          ) : null}
          <Pressable onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${poi.latitude},${poi.longitude}`)}>
            <Text style={styles.link}>Open in Google Maps</Text>
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
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: colors.ink, fontSize: 22, fontWeight: '900' },
  hook: { color: colors.ink, fontSize: 24, fontWeight: '900', lineHeight: 30 },
  text: { color: colors.inkSoft, lineHeight: 22 },
  buttonGap: { gap: 10 },
  infoRow: { gap: 4 },
  infoLabel: { color: colors.ink, fontWeight: '800' },
  factRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  factIndex: { color: colors.primary, fontWeight: '900', width: 24 },
  link: { color: colors.primary, fontWeight: '800', fontSize: 16 },
})
