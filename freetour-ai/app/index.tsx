import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Card, EmptyState, HeroCard, PoiImage, PrimaryButton, Screen, Section, SecondaryButton } from '../src/components/ui'
import { colors } from '../src/constants/theme'
import { cities } from '../src/data/pois'
import { useBoot } from '../src/hooks/useBoot'
import { useAppStore } from '../src/store/appStore'

export default function HomeScreen() {
  const hydrated = useBoot()
  const user = useAppStore((state) => state.user)
  const activeRoute = useAppStore((state) => state.activeRoute)
  const pois = useAppStore((state) => state.pois)
  const city = cities[0]
  const favourites = pois.filter((poi) => user.favouritePoiIds.includes(poi.id))

  if (!hydrated) {
    return (
      <Screen>
        <Card>
          <Text style={styles.headline}>Preparing your city guide</Text>
          <Text style={styles.body}>Recovering your route, your saved places and your preferred style.</Text>
        </Card>
      </Screen>
    )
  }

  if (!user.onboardingCompleted) {
    return (
      <Screen>
        <HeroCard
          title="A more elegant way to discover Barcelona"
          subtitle="Not a list of places. A curated guide with atmosphere, context and a clear next step."
          ctaLabel="Start setup"
          onPress={() => router.push('/onboarding')}
        />
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <HeroCard
        title={`Barcelona, curated for walking`}
        subtitle="A calmer, more refined interface for deciding where to go next, what matters there and how to keep moving without friction."
        ctaLabel="Open walking mode"
        onPress={() => router.push('/walk')}
      />

      <Section title="Your next move" subtitle="Three clear paths, designed to feel intentional.">
        <View style={styles.featureGrid}>
          <FeatureCard title="Walking mode" subtitle="Context-aware guidance while you move through the city." onPress={() => router.push('/walk')} />
          <FeatureCard title="Planned route" subtitle="A cleaner itinerary shaped around your available time." onPress={() => router.push('/route-planner')} />
          <FeatureCard title="Personal style" subtitle="Language, narration and pace tuned to your taste." onPress={() => router.push('/settings')} />
        </View>
      </Section>

      <Section title="Selected places" subtitle="Presented more like a travel magazine than a directory.">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {pois.slice(0, 6).map((poi) => (
            <Pressable key={poi.id} style={styles.editorialCard} onPress={() => router.push({ pathname: '/poi/[id]', params: { id: poi.id } } as any)}>
              <PoiImage uri={poi.imageUrl} emoji="◆" height={200} rounded={24} />
              <Text style={styles.cardEyebrow}>{poi.category}</Text>
              <Text style={styles.cardTitle}>{poi.name}</Text>
              <Text style={styles.cardText} numberOfLines={3}>{poi.shortNarrative}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Section>

      <Section title="Saved rhythm" subtitle="The app should remember where you were, not reset the experience.">
        <Card>
          {activeRoute ? (
            <>
              <Text style={styles.headline}>{activeRoute.title}</Text>
              <Text style={styles.body}>{activeRoute.stops.length} stops, {activeRoute.totalMinutes} minutes, still saved for when you return.</Text>
              <View style={styles.buttonGap}>
                <PrimaryButton label="Resume route" onPress={() => router.push('/route-planner')} />
                <SecondaryButton label="Continue walking" onPress={() => router.push('/walk')} />
              </View>
            </>
          ) : (
            <EmptyState
              emoji="◆"
              title="No saved route yet"
              subtitle="When you create one, it should feel like part of your trip, not a temporary test."
              action={<PrimaryButton label="Create route" onPress={() => router.push('/route-planner')} />}
            />
          )}
        </Card>
      </Section>

      <Section title="Around you in Barcelona" subtitle="Not just big icons. Also squares, monuments and smaller details worth stopping for.">
        <Card>
          {pois.slice(0, 5).map((poi, index) => (
            <Pressable key={poi.id} style={styles.savedRow} onPress={() => router.push({ pathname: '/poi/[id]', params: { id: poi.id } } as any)}>
              <Text style={styles.savedIndex}>0{index + 1}</Text>
              <View style={styles.savedCopy}>
                <Text style={styles.savedTitle}>{poi.name}</Text>
                <Text style={styles.savedText}>{poi.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </Card>
      </Section>

      <Section title="Saved places" subtitle="What caught your attention, kept accessible.">
        <Card>
          {favourites.length ? (
            favourites.slice(0, 3).map((poi) => (
              <Pressable key={poi.id} style={styles.savedRow} onPress={() => router.push({ pathname: '/poi/[id]', params: { id: poi.id } } as any)}>
                <Text style={styles.savedIndex}>0{favourites.indexOf(poi) + 1}</Text>
                <View style={styles.savedCopy}>
                  <Text style={styles.savedTitle}>{poi.name}</Text>
                  <Text style={styles.savedText}>{poi.subtitle}</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={styles.body}>You have not saved any places yet.</Text>
          )}
        </Card>
      </Section>

      <View style={styles.cityNote}>
        <Text style={styles.cityNoteText}>{city.name} edition</Text>
      </View>
    </Screen>
  )
}

function FeatureCard({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable style={styles.featureCard} onPress={onPress}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{subtitle}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  featureGrid: { gap: 12 },
  featureCard: { backgroundColor: colors.card, borderRadius: 26, padding: 20, borderWidth: 1, borderColor: colors.border, gap: 10 },
  featureTitle: { fontSize: 20, fontWeight: '800', color: colors.ink },
  featureText: { color: colors.inkSoft, lineHeight: 21 },
  carousel: { gap: 14, paddingRight: 12 },
  editorialCard: { width: 300, backgroundColor: colors.card, borderRadius: 28, padding: 12, borderWidth: 1, borderColor: colors.border, gap: 10 },
  cardEyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  cardTitle: { color: colors.ink, fontSize: 22, fontWeight: '900' },
  cardText: { color: colors.inkSoft, lineHeight: 22 },
  headline: { color: colors.ink, fontSize: 22, fontWeight: '900', lineHeight: 28 },
  body: { color: colors.inkSoft, lineHeight: 22 },
  buttonGap: { gap: 10 },
  savedRow: { flexDirection: 'row', gap: 14, alignItems: 'center', paddingVertical: 8 },
  savedIndex: { color: colors.primary, fontSize: 18, fontWeight: '900', width: 28 },
  savedCopy: { flex: 1, gap: 2 },
  savedTitle: { color: colors.ink, fontWeight: '800' },
  savedText: { color: colors.inkSoft },
  cityNote: { alignItems: 'center', paddingBottom: 8 },
  cityNoteText: { color: colors.inkMuted, textTransform: 'uppercase', letterSpacing: 2, fontSize: 11, fontWeight: '800' },
})
