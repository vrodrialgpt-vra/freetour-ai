import { router } from 'expo-router'
import { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Card, Chip, EmptyState, HeroCard, PrimaryButton, Screen, Section } from '../src/components/ui'
import { colors } from '../src/constants/theme'
import { useAppStore } from '../src/store/appStore'

const presets = [90, 120, 180, 240]

export default function RoutePlannerScreen() {
  const [minutes, setMinutes] = useState(120)
  const createRoute = useAppStore((state) => state.createRoute)
  const route = useAppStore((state) => state.activeRoute)
  const pois = useAppStore((state) => state.pois)

  return (
    <Screen scroll>
      <HeroCard
        title="Una ruta bonita y fácil de seguir"
        subtitle="Elige el tiempo que tienes y te proponemos un paseo lógico, agradable y sin sensación de improvisación cutre."
        ctaLabel="Generar ruta"
        onPress={() => createRoute(minutes)}
      />

      <Section title="¿Cuánto tiempo tienes?" subtitle="Sin formularios largos ni decisiones raras.">
        <View style={styles.chips}>
          {presets.map((preset) => (
            <Chip key={preset} label={`${preset} min`} active={minutes === preset} onPress={() => setMinutes(preset)} />
          ))}
        </View>
      </Section>

      <Section title="Tu ruta" subtitle="Con paradas visuales y tocables, no una lista seca.">
        <Card>
          {route ? (
            <>
              <Text style={styles.title}>{route.title}</Text>
              <Text style={styles.text}>{route.summary}</Text>
              <Text style={styles.helper}>{route.stops.length} paradas · {route.totalMinutes} min · {route.totalWalkingMinutes} min caminando</Text>
              <View style={styles.routeList}>
                {route.stops.map((stop) => {
                  const poi = pois.find((item) => item.id === stop.poiId)
                  if (!poi) return null
                  return (
                    <Pressable key={stop.poiId} style={styles.stopRow} onPress={() => router.push({ pathname: '/poi/[id]', params: { id: stop.poiId } } as any)}>
                      <Text style={styles.stopOrder}>{stop.order}</Text>
                      {poi.imageUrl ? <Image source={{ uri: poi.imageUrl }} style={styles.stopImage} resizeMode="cover" /> : null}
                      <View style={styles.stopCopy}>
                        <Text style={styles.stopTitle}>{poi.name}</Text>
                        <Text style={styles.stopMeta}>{stop.walkFromPreviousMin} min andando · {stop.visitDurationMin} min allí</Text>
                        <Text numberOfLines={2} style={styles.stopExcerpt}>{poi.hook}</Text>
                      </View>
                    </Pressable>
                  )
                })}
              </View>
            </>
          ) : (
            <EmptyState
              emoji="🗺️"
              title="Todavía no tienes una ruta creada"
              subtitle="Pulsa generar y te montamos un recorrido claro para que no tengas que ir saltando entre sitios sin sentido."
              action={<PrimaryButton label="Generar ruta" onPress={() => createRoute(minutes)} />}
            />
          )}
        </Card>
      </Section>
    </Screen>
  )
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  title: { fontSize: 21, fontWeight: '900', color: colors.ink },
  text: { color: colors.inkSoft, lineHeight: 21 },
  helper: { color: colors.primaryDark, fontWeight: '700' },
  routeList: { gap: 12, marginTop: 6 },
  stopRow: { flexDirection: 'row', gap: 12, backgroundColor: colors.cardMuted, borderRadius: 18, padding: 10, alignItems: 'center' },
  stopOrder: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E7EBFF', textAlign: 'center', textAlignVertical: 'center', lineHeight: 30, color: colors.primaryDark, fontWeight: '800' },
  stopImage: { width: 72, height: 72, borderRadius: 14 },
  stopCopy: { flex: 1, gap: 4 },
  stopTitle: { fontWeight: '800', color: colors.ink },
  stopMeta: { color: colors.inkSoft },
  stopExcerpt: { color: colors.primaryDark, lineHeight: 18 },
})
