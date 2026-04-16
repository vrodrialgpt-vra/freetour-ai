import { router } from 'expo-router'
import { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Card, Chip, HeroCard, PrimaryButton, Screen, Section } from '../src/components/ui'
import { colors } from '../src/constants/theme'
import { useAppStore } from '../src/store/appStore'

const presets = [90, 120, 240]

export default function RoutePlannerScreen() {
  const [minutes, setMinutes] = useState(120)
  const createRoute = useAppStore((state) => state.createRoute)
  const route = useAppStore((state) => state.activeRoute)
  const pois = useAppStore((state) => state.pois)

  return (
    <Screen scroll>
      <HeroCard
        title="Tu ruta en segundos"
        subtitle="Elige el tiempo que tienes y te proponemos un paseo claro, lógico y fácil de seguir."
        ctaLabel="Generar ruta"
        onPress={() => createRoute(minutes)}
      />

      <Section title="¿Cuánto tiempo tienes?" subtitle="Empieza sin formularios largos.">
        <View style={styles.chips}>
          {presets.map((preset) => (
            <Chip key={preset} label={`${preset} min`} active={minutes === preset} onPress={() => setMinutes(preset)} />
          ))}
        </View>
      </Section>

      <Section title="Tu ruta" subtitle="Pensada para caminar bien, no para hacerte zigzaguear.">
        <Card>
          {route ? (
            <>
              <Text style={styles.title}>{route.title}</Text>
              <Text style={styles.text}>{route.summary}</Text>
              <Text style={styles.helper}>{route.stops.length} paradas · {route.totalMinutes} min · {route.totalWalkingMinutes} min caminando</Text>
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
            </>
          ) : (
            <>
              <Text style={styles.title}>Aún no has creado una ruta</Text>
              <Text style={styles.text}>Elige tu tiempo y te proponemos una ruta lista para salir a caminar.</Text>
            </>
          )}
        </Card>
      </Section>
    </Screen>
  )
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  title: { fontSize: 20, fontWeight: '800', color: colors.ink },
  text: { color: colors.inkSoft, lineHeight: 21 },
  helper: { color: colors.primaryDark, fontWeight: '700' },
  stopRow: { flexDirection: 'row', gap: 12, paddingTop: 12 },
  stopOrder: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EAF4FF', textAlign: 'center', textAlignVertical: 'center', lineHeight: 28, color: colors.primaryDark, fontWeight: '800' },
  stopImage: { width: 72, height: 72, borderRadius: 14 },
  stopCopy: { flex: 1, gap: 4 },
  stopTitle: { fontWeight: '800', color: colors.ink },
  stopMeta: { color: colors.inkSoft },
  stopExcerpt: { color: colors.primaryDark, lineHeight: 18 },
})
