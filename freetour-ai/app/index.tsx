import { router } from 'expo-router'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Card, EmptyState, HeroCard, PrimaryButton, Screen, Section, SecondaryButton } from '../src/components/ui'
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

  if (!hydrated) {
    return (
      <Screen>
        <Card>
          <Text style={styles.title}>Preparando tu guía…</Text>
          <Text style={styles.text}>Cargamos tu ruta, tus favoritos y tu estilo de visita.</Text>
        </Card>
      </Screen>
    )
  }

  if (!user.onboardingCompleted) {
    return (
      <Screen>
        <HeroCard
          title="Descubre la ciudad sin pensar demasiado"
          subtitle="Configura tu estilo en un minuto y deja que la app te sugiera qué ver, cuándo parar y qué merece la pena."
          ctaLabel="Empezar"
          onPress={() => router.push('/onboarding')}
        />
        <Card>
          <Text style={styles.title}>Empieza fácil</Text>
          <Text style={styles.text}>Elige idioma, activa ubicación y ya tienes una guía mucho más útil que una lista suelta de sitios.</Text>
        </Card>
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <HeroCard
        title={`Tu guía de ${city.name}`}
        subtitle="Bonita, rápida y pensada para decidir qué hacer en segundos mientras paseas por la ciudad."
        ctaLabel="Empezar a explorar"
        onPress={() => router.push('/walk')}
      />

      <Section title="Haz algo ya" subtitle="Todo lo importante, claro y a un toque.">
        <View style={styles.grid}>
          <QuickAction emoji="🎧" title="Modo paseo" subtitle={preferences.audioMode === 'auto' ? 'Guía automática' : 'Guía manual'} onPress={() => router.push('/walk')} />
          <QuickAction emoji="🗺️" title="Crear ruta" subtitle="Según tu tiempo" onPress={() => router.push('/route-planner')} />
          <QuickAction emoji="⭐" title="Guardados" subtitle={`${user.favouritePoiIds.length} favoritos`} onPress={() => router.push('/settings')} />
          <QuickAction emoji="⚙️" title="Tu estilo" subtitle="Audio, idioma y ritmo" onPress={() => router.push('/settings')} />
        </View>
      </Section>

      <Section title="Sitios que sí apetecen" subtitle="Con imagen, gancho y acceso directo a la ficha.">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {pois.slice(0, 4).map((poi) => (
            <Pressable key={poi.id} style={styles.poiCard} onPress={() => router.push({ pathname: '/poi/[id]', params: { id: poi.id } } as any)}>
              {poi.imageUrl ? <Image source={{ uri: poi.imageUrl }} style={styles.poiImage} resizeMode="cover" /> : null}
              <View style={styles.poiCardBody}>
                <Text style={styles.poiCardTitle}>{poi.name}</Text>
                <Text style={styles.poiCardSubtitle}>{poi.subtitle}</Text>
                <Text numberOfLines={2} style={styles.poiCardText}>{poi.hook}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </Section>

      <Section title="Tu plan" subtitle="Nada de cajas raras ni pantallas sin salida.">
        <Card>
          {activeRoute ? (
            <>
              <Text style={styles.title}>{activeRoute.title}</Text>
              <Text style={styles.text}>{activeRoute.stops.length} paradas, {activeRoute.totalMinutes} min y recorrido listo para seguir.</Text>
              <View style={styles.buttonGap}>
                <PrimaryButton label="Abrir mi ruta" onPress={() => router.push('/route-planner')} />
                <SecondaryButton label="Salir a pasear" onPress={() => router.push('/walk')} />
              </View>
            </>
          ) : (
            <EmptyState
              emoji="✨"
              title="Todavía no tienes una ruta hecha"
              subtitle="Dinos cuánto tiempo tienes y te montamos una ruta clara, bonita y caminable en segundos."
              action={<PrimaryButton label="Crear ruta ahora" onPress={() => router.push('/route-planner')} />}
            />
          )}
        </Card>
      </Section>

      <Section title="Tu experiencia, a tu manera" subtitle="Para que la app se sienta más personal y menos genérica.">
        <Card>
          <View style={styles.preferenceRow}><Text style={styles.preferenceLabel}>Idioma</Text><Text style={styles.preferenceValue}>{preferences.language === 'es' ? 'Español' : 'English'}</Text></View>
          <View style={styles.preferenceRow}><Text style={styles.preferenceLabel}>Narración</Text><Text style={styles.preferenceValue}>{translateStyle(preferences.narrativeStyle)}</Text></View>
          <View style={styles.preferenceRow}><Text style={styles.preferenceLabel}>Profundidad</Text><Text style={styles.preferenceValue}>{translateDepth(preferences.depth)}</Text></View>
          <SecondaryButton label="Cambiar preferencias" onPress={() => router.push('/settings')} />
        </Card>
      </Section>
    </Screen>
  )
}

function QuickAction({ emoji, title, subtitle, onPress }: { emoji: string; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable style={styles.actionCard} onPress={onPress}>
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </Pressable>
  )
}

function translateStyle(style: string) {
  const map: Record<string, string> = {
    dynamic: 'Dinámico',
    classic: 'Clásico',
    family: 'Familiar',
    premium: 'Cultural',
    brief: 'Breve',
    curious: 'Curioso',
  }
  return map[style] ?? style
}

function translateDepth(depth: string) {
  const map: Record<string, string> = {
    short: 'Muy breve',
    standard: 'Estándar',
    expanded: 'Ampliado',
  }
  return map[depth] ?? depth
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  horizontalList: { gap: 12, paddingRight: 12 },
  poiCard: { width: 250, backgroundColor: colors.card, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  poiImage: { width: '100%', height: 140 },
  poiCardBody: { padding: 14, gap: 6 },
  poiCardTitle: { fontSize: 17, fontWeight: '800', color: colors.ink },
  poiCardSubtitle: { color: colors.primaryDark, fontWeight: '700' },
  poiCardText: { color: colors.inkSoft, lineHeight: 19 },
  actionCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  actionEmoji: { fontSize: 24 },
  actionTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  actionSubtitle: { color: colors.inkSoft, lineHeight: 18 },
  title: { fontSize: 21, fontWeight: '900', color: colors.ink },
  text: { color: colors.inkSoft, lineHeight: 21 },
  buttonGap: { gap: 10 },
  preferenceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 2 },
  preferenceLabel: { color: colors.inkMuted, fontWeight: '700' },
  preferenceValue: { color: colors.ink, fontWeight: '800' },
})
