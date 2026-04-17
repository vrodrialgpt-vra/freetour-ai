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
  const preferences = useAppStore((state) => state.preferences)
  const activeRoute = useAppStore((state) => state.activeRoute)
  const pois = useAppStore((state) => state.pois)
  const city = cities[0]
  const favourites = pois.filter((poi) => user.favouritePoiIds.includes(poi.id))

  if (!hydrated) {
    return (
      <Screen>
        <Card>
          <Text style={styles.title}>Cargando una versión mejor…</Text>
          <Text style={styles.text}>Estamos recuperando tus preferencias, guardados y última ruta.</Text>
        </Card>
      </Screen>
    )
  }

  if (!user.onboardingCompleted) {
    return (
      <Screen>
        <HeroCard
          title="Explora Barcelona como si alguien te guiara bien"
          subtitle="Una guía bonita, simple y útil para decidir rápido qué ver, qué escuchar y por dónde seguir."
          ctaLabel="Configurar en 1 minuto"
          onPress={() => router.push('/onboarding')}
        />
        <Card>
          <Text style={styles.title}>Nada de listas secas</Text>
          <Text style={styles.text}>Aquí tienes rutas, fichas visuales, consejos prácticos y explicaciones por voz, todo pensado para usarlo caminando.</Text>
        </Card>
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <HeroCard
        title={`Descubre ${city.name} sin complicarte`}
        subtitle="Te recomiendo sitios, te explico lo importante y te dejo guardar tu plan para que no se pierda al cerrar la web."
        ctaLabel="Empezar paseo"
        onPress={() => router.push('/walk')}
      />

      <View style={styles.statsRow}>
        <MiniStat label="Guardados" value={`${user.favouritePoiIds.length}`} />
        <MiniStat label="Visitados" value={`${user.visitedPoiIds.length}`} />
        <MiniStat label="Idioma" value={preferences.language === 'es' ? 'ES' : 'EN'} />
      </View>

      <Section title="Haz algo ahora" subtitle="Tres caminos claros, sin pantallas raras.">
        <View style={styles.actionGrid}>
          <ActionTile emoji="🎧" title="Paseo guiado" subtitle="La app te acompaña mientras caminas" onPress={() => router.push('/walk')} />
          <ActionTile emoji="🗺️" title="Crear ruta" subtitle="Según tu tiempo disponible" onPress={() => router.push('/route-planner')} />
          <ActionTile emoji="⚙️" title="Ajustes" subtitle="Tu estilo, audio y preferencias" onPress={() => router.push('/settings')} />
        </View>
      </Section>

      <Section title="Imprescindibles bonitos" subtitle="Ahora sí, con imagen fiable y ficha útil.">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {pois.slice(0, 4).map((poi) => (
            <Pressable key={poi.id} style={styles.poiCard} onPress={() => router.push({ pathname: '/poi/[id]', params: { id: poi.id } } as any)}>
              <PoiImage uri={poi.imageUrl} emoji="📸" height={160} rounded={20} />
              <View style={styles.poiBody}>
                <Text style={styles.poiTitle}>{poi.name}</Text>
                <Text style={styles.poiSubtitle}>{poi.subtitle}</Text>
                <Text style={styles.poiHook} numberOfLines={2}>{poi.hook}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </Section>

      <Section title="Tu plan guardado" subtitle="Para seguir donde lo dejaste.">
        <Card>
          {activeRoute ? (
            <>
              <Text style={styles.title}>{activeRoute.title}</Text>
              <Text style={styles.text}>{activeRoute.stops.length} paradas, {activeRoute.totalMinutes} min y se conserva aunque cierres y vuelvas.</Text>
              <View style={styles.buttonGap}>
                <PrimaryButton label="Abrir mi ruta" onPress={() => router.push('/route-planner')} />
                <SecondaryButton label="Ir al paseo" onPress={() => router.push('/walk')} />
              </View>
            </>
          ) : (
            <EmptyState
              emoji="✨"
              title="Aún no tienes una ruta guardada"
              subtitle="La próxima que generes se queda guardada para que no sientas la app como algo frágil o temporal."
              action={<PrimaryButton label="Crear mi ruta" onPress={() => router.push('/route-planner')} />}
            />
          )}
        </Card>
      </Section>

      <Section title="Tus guardados" subtitle="Lo que te llamó la atención, a mano.">
        <Card>
          {favourites.length ? (
            favourites.slice(0, 3).map((poi) => (
              <Pressable key={poi.id} style={styles.savedRow} onPress={() => router.push({ pathname: '/poi/[id]', params: { id: poi.id } } as any)}>
                <Text style={styles.savedBullet}>★</Text>
                <View style={styles.savedCopy}>
                  <Text style={styles.savedTitle}>{poi.name}</Text>
                  <Text style={styles.savedText}>{poi.subtitle}</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={styles.text}>Todavía no has guardado sitios. Cuando lo hagas, aparecerán aquí.</Text>
          )}
        </Card>
      </Section>
    </Screen>
  )
}

function ActionTile({ emoji, title, subtitle, onPress }: { emoji: string; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable style={styles.actionTile} onPress={onPress}>
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </Pressable>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: colors.border, gap: 2 },
  statValue: { fontSize: 20, fontWeight: '900', color: colors.ink },
  statLabel: { color: colors.inkMuted, fontWeight: '700' },
  actionGrid: { gap: 12 },
  actionTile: { backgroundColor: colors.card, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 8 },
  actionEmoji: { fontSize: 24 },
  actionTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  actionSubtitle: { color: colors.inkSoft, lineHeight: 20 },
  carousel: { gap: 12, paddingRight: 12 },
  poiCard: { width: 280, backgroundColor: colors.card, borderRadius: 24, padding: 10, borderWidth: 1, borderColor: colors.border, gap: 12 },
  poiBody: { gap: 4, paddingHorizontal: 2, paddingBottom: 4 },
  poiTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  poiSubtitle: { color: colors.primaryDark, fontWeight: '700' },
  poiHook: { color: colors.inkSoft, lineHeight: 20 },
  title: { fontSize: 21, fontWeight: '900', color: colors.ink },
  text: { color: colors.inkSoft, lineHeight: 21 },
  buttonGap: { gap: 10 },
  savedRow: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 6 },
  savedBullet: { color: colors.sun, fontSize: 18 },
  savedCopy: { flex: 1, gap: 2 },
  savedTitle: { fontWeight: '800', color: colors.ink },
  savedText: { color: colors.inkSoft },
})
