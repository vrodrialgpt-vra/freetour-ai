import { useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Card, Chip, HeroCard, PrimaryButton, Screen, Section } from '../src/components/ui'
import { colors } from '../src/constants/theme'
import { useAppStore } from '../src/store/appStore'

const presets = [90, 120, 240]

export default function RoutePlannerScreen() {
  const [minutes, setMinutes] = useState(120)
  const createRoute = useAppStore((state) => state.createRoute)
  const route = useAppStore((state) => state.activeRoute)
  const pois = useAppStore((state) => state.pois)
  const preferences = useAppStore((state) => state.preferences)
  const computedRoute = useMemo(() => route, [route])

  return (
    <Screen scroll>
      <HeroCard
        title="Ruta automática"
        subtitle="Le dices cuánto tiempo tienes y la app te devuelve una ruta lógica, caminable y conectada con el modo paseo."
        ctaLabel="Generar ruta"
        onPress={() => createRoute(minutes)}
      />

      <Section title="Tiempo disponible" subtitle="MVP: entrada simple para arrancar rápido.">
        <View style={styles.chips}>
          {presets.map((preset) => (
            <Chip key={preset} label={`${preset} min`} active={minutes === preset} onPress={() => setMinutes(preset)} />
          ))}
        </View>
      </Section>

      <Section title="Cómo piensa la app" subtitle="Heurística simple, mantenible y realista para un MVP.">
        <Card>
          <Text style={styles.cardText}>1. Filtra por ciudad, intereses y categorías ocultas. 2. Puntúa por relevancia turística + preferencias. 3. Ordena con un nearest neighbour para evitar zigzags absurdos. 4. Ajusta número de paradas a tu tiempo.</Text>
          <Text style={styles.helper}>Prioridad actual: {preferences.routePreference === 'shorter' ? 'ruta corta' : 'ruta rica en contenido'}.</Text>
        </Card>
      </Section>

      <Section title="Resultado" subtitle="Lo importante visible de un vistazo.">
        <Card>
          {computedRoute ? (
            <>
              <Text style={styles.routeTitle}>{computedRoute.title}</Text>
              <Text style={styles.cardText}>{computedRoute.summary}</Text>
              <Text style={styles.helper}>{computedRoute.stops.length} paradas · {computedRoute.totalMinutes} min · {computedRoute.totalWalkingMinutes} min caminando</Text>
              {computedRoute.stops.map((stop) => {
                const poi = pois.find((item) => item.id === stop.poiId)
                if (!poi) return null
                return (
                  <View key={stop.poiId} style={styles.stopRow}>
                    <Text style={styles.stopOrder}>{stop.order}</Text>
                    <View style={styles.stopCopy}>
                      <Text style={styles.stopTitle}>{poi.name}</Text>
                      <Text style={styles.stopMeta}>{stop.walkFromPreviousMin} min andando · {stop.visitDurationMin} min de visita</Text>
                    </View>
                  </View>
                )
              })}
            </>
          ) : (
            <Text style={styles.cardText}>Todavía no has generado ninguna ruta. Para el MVP, queremos que esto se resuelva en menos de 10 segundos y sin formularios largos.</Text>
          )}
        </Card>
      </Section>
    </Screen>
  )
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cardText: { color: colors.inkSoft, lineHeight: 21 },
  helper: { color: colors.primaryDark, fontWeight: '700' },
  routeTitle: { fontSize: 20, fontWeight: '800', color: colors.ink },
  stopRow: { flexDirection: 'row', gap: 12, paddingTop: 12 },
  stopOrder: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EAF4FF', textAlign: 'center', textAlignVertical: 'center', lineHeight: 28, color: colors.primaryDark, fontWeight: '800' },
  stopCopy: { flex: 1, gap: 4 },
  stopTitle: { fontWeight: '800', color: colors.ink },
  stopMeta: { color: colors.inkSoft },
})
