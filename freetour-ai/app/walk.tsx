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
        title={active ? 'Paseo activado' : 'Modo paseo, pero bien resuelto'}
        subtitle={active ? 'Cuando tengas algo interesante cerca, te lo soltamos claro, visual y sin ruido.' : 'Actívalo para que la ciudad te vaya proponiendo paradas sin dejarte delante de una pantalla vacía.'}
        ctaLabel={active ? 'Pausar paseo' : 'Activar paseo'}
        onPress={() => setActive((value) => !value)}
      />

      <Card style={styles.mapCard}>
        {Platform.OS === 'web' ? (
          <View style={styles.mapFallback}>
            <Text style={styles.mapEmoji}>🧭</Text>
            <Text style={styles.mapTitle}>Vista rápida del paseo</Text>
            <Text style={styles.text}>En web te enseñamos una vista ligera y clara. En móvil se apoya además en mapa interactivo.</Text>
          </View>
        ) : (
          <NativeMap pois={pois} route={route} initialRegion={city.center} />
        )}
      </Card>

      <Section title="Qué haría yo ahora" subtitle="La app debería orientarte, no dejarte adivinar.">
        <Card>
          {leadPoi ? (
            <>
              <PoiImage uri={leadPoi.imageUrl} emoji="🎧" height={190} rounded={20} />
              <Text style={styles.poiTitle}>{leadPoi.name}</Text>
              <Text style={styles.poiSubtitle}>{leadPoi.subtitle}</Text>
              <Text style={styles.text}>{leadPoi.shortNarrative}</Text>
              <Text style={styles.helper}>{Math.round(nearby[0]?.distanceMeters ?? 0)} m · audio listo</Text>
              <View style={styles.buttonGap}>
                <PrimaryButton label="Escuchar ahora" onPress={replayLead} />
                <SecondaryButton label="Abrir ficha" onPress={() => router.push({ pathname: '/poi/[id]', params: { id: leadPoi.id } } as any)} />
              </View>
            </>
          ) : (
            <EmptyState
              emoji="🚶"
              title={active ? 'Sigue andando un poco más' : 'El paseo está parado'}
              subtitle={active ? 'Todavía no detecto un punto claro cerca, pero abajo te dejo recomendaciones visuales para no perder el ritmo.' : 'Si activas el paseo, la app intentará proponerte la siguiente parada sin que tengas que buscarla tú.'}
              action={<PrimaryButton label={active ? 'Seguir explorando' : 'Activar paseo'} onPress={() => setActive(true)} />}
            />
          )}
        </Card>
      </Section>

      <Section title="Recomendaciones inmediatas" subtitle="Aunque el paseo no dispare audio, aquí siempre tienes algo útil.">
        <View style={styles.suggestionList}>
          {(nearby.length ? nearby.slice(0, 3).map((item) => item.poi) : fallbackSuggestions).map((poi) => (
            <Card key={poi.id} style={styles.suggestionCard}>
              <PoiImage uri={poi.imageUrl} emoji="📍" height={150} rounded={18} />
              <Text style={styles.poiTitle}>{poi.name}</Text>
              <Text style={styles.poiSubtitle}>{poi.subtitle}</Text>
              <Text style={styles.text} numberOfLines={3}>{poi.hook}</Text>
              <SecondaryButton label="Ver sitio" onPress={() => router.push({ pathname: '/poi/[id]', params: { id: poi.id } } as any)} />
            </Card>
          ))}
        </View>
      </Section>

      <Section title="Tu contexto" subtitle="Pequeñas ayudas para que esto se sienta más estable.">
        <Card>
          <Text style={styles.text}>{route ? `Tienes una ruta activa de ${route.totalMinutes} min guardada.` : 'Todavía no tienes ruta activa guardada.'}</Text>
          {permissionError ? <Text style={styles.error}>{permissionError}</Text> : <Text style={styles.ok}>Ubicación y estado del paseo listos para seguir mejorando la experiencia.</Text>}
          <SecondaryButton label="Ajustes del paseo" onPress={() => router.push('/settings')} />
        </Card>
      </Section>
    </Screen>
  )
}

function NativeMap({ pois, route, initialRegion }: { pois: any[]; route: any; initialRegion: any }) {
  const MapView = require('react-native-maps').default
  const { Marker, Polyline } = require('react-native-maps')

  return (
    <MapView style={styles.map} initialRegion={initialRegion}>
      {pois.map((poi) => (
        <Marker key={poi.id} coordinate={{ latitude: poi.latitude, longitude: poi.longitude }} title={poi.name} description={poi.subtitle} />
      ))}
      {route ? (
        <Polyline
          coordinates={route.stops
            .map((stop: any) => pois.find((poi) => poi.id === stop.poiId))
            .filter(Boolean)
            .map((poi: any) => ({ latitude: poi.latitude, longitude: poi.longitude }))}
          strokeColor={colors.mapRoute}
          strokeWidth={4}
        />
      ) : null}
    </MapView>
  )
}

const styles = StyleSheet.create({
  mapCard: { padding: 0, overflow: 'hidden' },
  map: { height: 260, borderRadius: 18 },
  mapFallback: { height: 240, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardMuted, padding: 24, gap: 10 },
  mapEmoji: { fontSize: 44 },
  mapTitle: { fontSize: 20, fontWeight: '800', color: colors.ink },
  poiTitle: { fontSize: 20, fontWeight: '900', color: colors.ink },
  poiSubtitle: { color: colors.primaryDark, fontWeight: '700' },
  text: { color: colors.inkSoft, lineHeight: 21 },
  helper: { color: colors.primaryDark, fontWeight: '700' },
  buttonGap: { gap: 10 },
  suggestionList: { gap: 12 },
  suggestionCard: { padding: 10 },
  error: { color: colors.danger, fontWeight: '700' },
  ok: { color: colors.success, fontWeight: '700' },
})
