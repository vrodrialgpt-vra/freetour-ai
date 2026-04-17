import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { Card, EmptyState, HeroCard, PoiImage, PrimaryButton, Screen, SecondaryButton, Section } from '../src/components/ui'
import { colors } from '../src/constants/theme'
import { cities } from '../src/data/pois'
import { useWalkingGuide } from '../src/hooks/useWalkingGuide'
import { useAppStore } from '../src/store/appStore'

export default function WalkScreen() {
  const [active, setActive] = useState(false)
  const { nearby, leadPoi, permissionError, replayLead } = useWalkingGuide(active)
  const route = useAppStore((state) => state.activeRoute)
  const pois = useAppStore((state) => state.pois)
  const city = cities[0]
  const fallbackSuggestions = useMemo(() => pois.slice(0, 3), [pois])

  return (
    <Screen scroll>
      <HeroCard
        title={active ? 'Walking with context' : 'Walking mode, redesigned'}
        subtitle={active ? 'A calmer companion while you move, showing what deserves your attention next.' : 'The experience should feel guided and elegant, never empty or confusing.'}
        ctaLabel={active ? 'Pause walking mode' : 'Start walking mode'}
        onPress={() => setActive((value) => !value)}
      />

      <Section title="Now showing" subtitle="One clear recommendation, beautifully framed.">
        <Card>
          {leadPoi ? (
            <>
              <PoiImage uri={leadPoi.imageUrl} emoji="◆" height={220} rounded={24} />
              <Text style={styles.eyebrow}>Recommended now</Text>
              <Text style={styles.title}>{leadPoi.name}</Text>
              <Text style={styles.subtitle}>{leadPoi.subtitle}</Text>
              <Text style={styles.text}>{leadPoi.shortNarrative}</Text>
              <Text style={styles.meta}>{Math.round(nearby[0]?.distanceMeters ?? 0)} m away</Text>
              <View style={styles.buttonGap}>
                <PrimaryButton label="Play audio" onPress={replayLead} />
                <SecondaryButton label="Open place" onPress={() => router.push({ pathname: '/poi/[id]', params: { id: leadPoi.id } } as any)} />
              </View>
            </>
          ) : (
            <EmptyState
              emoji="◆"
              title={active ? 'No clear nearby stop yet' : 'Walking mode is currently off'}
              subtitle={active ? 'Keep moving, or use the curated suggestions below while the next highlight emerges.' : 'Turn it on and the app will try to surface meaningful places as you walk.'}
              action={<PrimaryButton label={active ? 'Keep browsing' : 'Start now'} onPress={() => setActive(true)} />}
            />
          )}
        </Card>
      </Section>

      <Section title="Curated nearby" subtitle="Even if the live guide is quiet, the screen should still feel rich.">
        <View style={styles.stack}>
          {(nearby.length ? nearby.slice(0, 3).map((item) => item.poi) : fallbackSuggestions).map((poi, index) => (
            <Card key={poi.id} style={styles.placeCard}>
              <PoiImage uri={poi.imageUrl} emoji="◆" height={170} rounded={22} />
              <Text style={styles.index}>0{index + 1}</Text>
              <Text style={styles.title}>{poi.name}</Text>
              <Text style={styles.subtitle}>{poi.subtitle}</Text>
              <Text style={styles.text} numberOfLines={3}>{poi.hook}</Text>
              <SecondaryButton label="View details" onPress={() => router.push({ pathname: '/poi/[id]', params: { id: poi.id } } as any)} />
            </Card>
          ))}
        </View>
      </Section>

      <Section title="Walking context" subtitle="Useful status, presented with more restraint.">
        <Card>
          <Text style={styles.text}>{route ? `Saved route available: ${route.totalMinutes} minutes in ${city.name}.` : 'No saved route is currently active.'}</Text>
          {permissionError ? <Text style={styles.error}>{permissionError}</Text> : <Text style={styles.ok}>The experience is ready to become more context-aware as you move.</Text>}
          {Platform.OS === 'web' ? <Text style={styles.note}>Map is simplified on web to keep the experience lighter.</Text> : null}
        </Card>
      </Section>
    </Screen>
  )
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: colors.ink, fontSize: 24, fontWeight: '900' },
  subtitle: { color: colors.inkSoft, fontWeight: '700' },
  text: { color: colors.inkSoft, lineHeight: 22 },
  meta: { color: colors.primary, fontWeight: '800' },
  buttonGap: { gap: 10 },
  stack: { gap: 12 },
  placeCard: { padding: 12 },
  index: { color: colors.primary, fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  error: { color: colors.danger, fontWeight: '700' },
  ok: { color: colors.success, fontWeight: '700' },
  note: { color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
})
