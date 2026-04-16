import { router } from 'expo-router'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Card, HeroCard, PrimaryButton, Screen, Section, SecondaryButton } from '../src/components/ui'
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
          <Text style={styles.title}>Cargando tu guía…</Text>
          <Text style={styles.text}>Estamos preparando tu experiencia.</Text>
        </Card>
      </Screen>
    )
  }

  if (!user.onboardingCompleted) {
    return (
      <Screen>
        <HeroCard
          title="Descubre la ciudad mientras caminas"
          subtitle="Activa el modo paseo y deja que la app te cuente lo mejor que tienes cerca."
          ctaLabel="Configurar en 1 minuto"
          onPress={() => router.push('/onboarding')}
        />
        <Card>
          <Text style={styles.title}>Así de fácil</Text>
          <Text style={styles.text}>1. Elige tu estilo. 2. Activa ubicación. 3. Empieza a pasear.</Text>
        </Card>
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <HeroCard
        title={`Hola, ${city.name}`}
        subtitle="Tu guía ya está lista. Puedes salir a caminar o pedir una ruta hecha para ti."
        ctaLabel="Iniciar modo paseo"
        onPress={() => router.push('/walk')}
      />

      <Section title="Empieza ahora" subtitle="Lo importante a un toque.">
        <View style={styles.grid}>
          <QuickAction emoji="🎧" title="Modo paseo" subtitle={preferences.audioMode === 'auto' ? 'Audio automático' : 'Audio manual'} onPress={() => router.push('/walk')} />
          <QuickAction emoji="🗺️" title="Crear ruta" subtitle="Según tu tiempo" onPress={() => router.push('/route-planner')} />
          <QuickAction emoji="⭐" title="Favoritos" subtitle={`${user.favouritePoiIds.length} guardados`} onPress={() => router.push('/settings')} />
          <QuickAction emoji="⚙️" title="Tu estilo" subtitle="Idioma, audio y más" onPress={() => router.push('/settings')} />
        </View>
      </Section>

      <Section title="Lugares que te recomiendo" subtitle="Con imagen, contexto y acceso rápido.">
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

      <Section title="Tu próxima experiencia" subtitle="Sin pasos raros, sin lío.">
        <Card>
          {activeRoute ? (
            <>
              <Text style={styles.title}>{activeRoute.title}</Text>
              <Text style={styles.text}>{activeRoute.stops.length} paradas, {activeRoute.totalMinutes} min en total.</Text>
              <View style={styles.buttonGap}>
                <PrimaryButton label="Ver mi ruta" onPress={() => router.push('/route-planner')} />
                <SecondaryButton label="Salir a caminar" onPress={() => router.push('/walk')} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>¿Tienes poco tiempo?</Text>
              <Text style={styles.text}>Te montamos una ruta clara y caminable en segundos.</Text>
              <PrimaryButton label="Crear una ruta" onPress={() => router.push('/route-planner')} />
            </>
          )}
        </Card>
      </Section>

      <Section title="Tu estilo de visita" subtitle="La experiencia se adapta a ti.">
        <Card>
          <Text style={styles.text}>Idioma: <Text style={styles.strong}>{preferences.language === 'es' ? 'Español' : 'English'}</Text></Text>
          <Text style={styles.text}>Narración: <Text style={styles.strong}>{translateStyle(preferences.narrativeStyle)}</Text></Text>
          <Text style={styles.text}>Profundidad: <Text style={styles.strong}>{translateDepth(preferences.depth)}</Text></Text>
          <Pressable onPress={() => router.push('/settings')}>
            <Text style={styles.link}>Cambiar preferencias</Text>
          </Pressable>
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
  poiCard: { width: 250, backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  poiImage: { width: '100%', height: 130 },
  poiCardBody: { padding: 12, gap: 6 },
  poiCardTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  poiCardSubtitle: { color: colors.primaryDark, fontWeight: '700' },
  poiCardText: { color: colors.inkSoft, lineHeight: 19 },
  actionCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  actionEmoji: { fontSize: 22 },
  actionTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  actionSubtitle: { color: colors.inkSoft, lineHeight: 18 },
  title: { fontSize: 20, fontWeight: '800', color: colors.ink },
  text: { color: colors.inkSoft, lineHeight: 21 },
  strong: { color: colors.ink, fontWeight: '800' },
  buttonGap: { gap: 10 },
  link: { color: colors.primary, fontWeight: '800' },
})
