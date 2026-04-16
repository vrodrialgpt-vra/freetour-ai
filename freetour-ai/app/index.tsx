import { router } from 'expo-router'
import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Card, HeroCard, PrimaryButton, Screen, Section } from '../src/components/ui'
import { colors } from '../src/constants/theme'
import { cities } from '../src/data/pois'
import { useBoot } from '../src/hooks/useBoot'
import { useAppStore } from '../src/store/appStore'

export default function HomeScreen() {
  const hydrated = useBoot()
  const user = useAppStore((state) => state.user)
  const preferences = useAppStore((state) => state.preferences)
  const activeRoute = useAppStore((state) => state.activeRoute)
  const city = useMemo(() => cities[0], [])

  if (!hydrated) {
    return (
      <Screen>
        <Card>
          <Text style={styles.loadingTitle}>Preparando tu guía…</Text>
          <Text style={styles.loadingText}>Cargando preferencias, ciudad y experiencia recomendada.</Text>
        </Card>
      </Screen>
    )
  }

  if (!user.onboardingCompleted) {
    return (
      <Screen>
        <HeroCard
          title="Tu guía en el bolsillo"
          subtitle="FreeTour AI te acompaña mientras caminas. Detecta sitios cercanos, te los cuenta en audio y te monta rutas en segundos."
          ctaLabel="Empezar"
          onPress={() => router.push('/onboarding')}
        />
        <Card>
          <Text style={styles.cardTitle}>Cómo se usa</Text>
          <Text style={styles.cardText}>1. Eliges ciudad y estilo. 2. Activas modo paseo. 3. La app te avisa y te cuenta lo importante sin agobiar.</Text>
        </Card>
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <HeroCard
        title={city.heroTitle}
        subtitle={city.heroSubtitle}
        ctaLabel="Iniciar modo paseo"
        onPress={() => router.push('/walk')}
      />

      <Section title="Hoy en un vistazo" subtitle="Todo lo importante, sin menús raros.">
        <View style={styles.quickGrid}>
          <QuickTile label="Modo paseo" value={preferences.audioMode === 'auto' ? 'Automático' : 'Manual'} icon="🎧" onPress={() => router.push('/walk')} />
          <QuickTile label="Ruta rápida" value={`${preferences.maxRouteMinutes} min`} icon="🗺️" onPress={() => router.push('/route-planner')} />
          <QuickTile label="Favoritos" value={`${user.favouritePoiIds.length}`} icon="⭐" onPress={() => router.push('/settings')} />
          <QuickTile label="Perfil" value={preferences.partyMode} icon="⚙️" onPress={() => router.push('/settings')} />
        </View>
      </Section>

      <Section title="Tu ciudad base" subtitle="Empezamos por Barcelona para lanzar rápido y bien.">
        <Card>
          <Text style={styles.cardTitle}>{city.name}</Text>
          <Text style={styles.cardText}>MVP centrado en una ciudad para clavar la experiencia antes de escalar. Arquitectura ya preparada para añadir más ciudades.</Text>
          <View style={styles.pillRow}>
            <Pill text="Audio tipo free tour" />
            <Pill text="Detección GPS" />
            <Pill text="Ruta automática" />
          </View>
        </Card>
      </Section>

      <Section title="Ruta activa" subtitle="La app recuerda por dónde ibas.">
        <Card>
          {activeRoute ? (
            <>
              <Text style={styles.cardTitle}>{activeRoute.title}</Text>
              <Text style={styles.cardText}>{activeRoute.summary}</Text>
              <Text style={styles.helperText}>{activeRoute.stops.length} paradas · {activeRoute.totalMinutes} min</Text>
              <PrimaryButton label="Ver ruta" onPress={() => router.push('/route-planner')} />
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>Todavía no tienes ruta</Text>
              <Text style={styles.cardText}>Dinos cuánto tiempo tienes y te proponemos una ruta andando, lógica y fácil de seguir.</Text>
              <PrimaryButton label="Crear ruta" onPress={() => router.push('/route-planner')} />
            </>
          )}
        </Card>
      </Section>

      <Section title="Lo que engancha" subtitle="Engagement útil, no molesto.">
        <Card>
          <Text style={styles.cardText}>En el MVP ya dejamos favoritos, histórico de descubrimientos, continuidad entre sesiones y recomendaciones suaves para seguir explorando.</Text>
          <Pressable onPress={() => router.push('/settings')}>
            <Text style={styles.link}>Ver preferencias de experiencia</Text>
          </Pressable>
        </Card>
      </Section>
    </Screen>
  )
}

function QuickTile({ label, value, icon, onPress }: { label: string; value: string; icon: string; onPress: () => void }) {
  return (
    <Pressable style={styles.quickTile} onPress={onPress}>
      <Text style={styles.quickIcon}>{icon}</Text>
      <Text style={styles.quickLabel}>{label}</Text>
      <Text style={styles.quickValue}>{value}</Text>
    </Pressable>
  )
}

function Pill({ text }: { text: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  loadingTitle: { fontSize: 22, fontWeight: '800', color: colors.ink },
  loadingText: { color: colors.inkSoft, lineHeight: 20 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickTile: { width: '47%', backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 6 },
  quickIcon: { fontSize: 22 },
  quickLabel: { color: colors.inkSoft, fontSize: 13, fontWeight: '700' },
  quickValue: { color: colors.ink, fontSize: 16, fontWeight: '800', textTransform: 'capitalize' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  cardText: { color: colors.inkSoft, lineHeight: 21 },
  helperText: { color: colors.primaryDark, fontWeight: '700' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#EAF4FF' },
  pillText: { color: colors.primaryDark, fontWeight: '700' },
  link: { color: colors.primary, fontWeight: '800' },
})
