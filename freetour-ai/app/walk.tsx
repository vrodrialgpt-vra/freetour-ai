import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { Card, EmptyState, HeroCard, PrimaryButton, Screen, SecondaryButton, Section } from '../src/components/ui'
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
  const featured = useMemo(() => pois.slice(0, 3), [pois])

  return (
    <Screen scroll>
      <HeroCard
        title={active ? 'Tu paseo está en marcha' : 'Explorar sin esfuerzo'}
        subtitle={active ? 'Camina a tu ritmo. Cuando tengas algo interesante cerca, te lo contaremos de forma simple.' : 'Activa el paseo y convierte un paseo normal en una visita guiada ligera, visual y útil.'}
        ctaLabel={active ? 'Pausar paseo' : 'Activar paseo'}
        onPress={() => setActive((value) => !value)}
      />

      <Card style={styles.mapCard}>
        {Platform.OS === 'web' ? (
          <View style={styles.mapFallback}>
            <Text style={styles.mapEmoji}>🗺️</Text>
            <Text style={styles.poiTitle}>Vista rápida de la ciudad</Text>
            <Text style={styles.text}>En móvil verás el mapa interactivo. En web te dejamos una vista ligera para que sigas descubriendo sin esperas raras.</Text>
          </View>
        ) : (
          <NativeMap pois={pois} route={route} initialRegion={city.center} />
        )}
      </Card>

      <Section title="Tu siguiente parada" subtitle="Siempre deberías ver algo útil aquí, no una pantalla muerta.">
        <Card>
          {leadPoi ? (
            <>
              <Text style={styles.poiTitle}>{leadPoi.name}</Text>
              <Text style={styles.poiSubtitle}>{leadPoi.subtitle}</Text>
              <Text style={styles.text}>{leadPoi.hook}</Text>
              <Text style={styles.helper}>{Math.round(nearby[0]?.distanceMeters ?? 0)} m de distancia</Text>
              <View style={styles.buttonGap}>
                <PrimaryButton label="Escuchar ahora" onPress={replayLead} />
                <SecondaryButton label="Ver ficha completa" onPress={() => router.push({ pathname: '/poi/[id]', params: { id: leadPoi.id } } as any)} />
                {active ? <SecondaryButton label="Pausar paseo" onPress={() => setActive(false)} /> : null}
              </View>
            </>
          ) : (
            <EmptyState
              emoji={active ? '🚶' : '🎧'}
              title={active ? 'Todavía no detecto una parada cercana' : 'El paseo aún no está activo'}
              subtitle={active ? 'Sigue caminando un poco más o abre una ficha recomendada mientras aparece el siguiente punto interesante.' : 'Actívalo y la app intentará acompañarte sin que tengas que ir buscando manualmente.'}
              action={<PrimaryButton label={active ? 'Ver recomendaciones' : 'Activar paseo'} onPress={() => setActive(true)} />}
            />
          )}
        </Card>
      </Section>

      <Section title="Mientras tanto, te recomiendo" subtitle="Para que nunca te quedes sin saber qué hacer.">
        <View style={styles.nearbyList}>
          {(nearby.length ? nearby.slice(0, 3).map((match) => match.poi) : featured).map((poi) => (
            <Pressable key={poi.id} style={styles.nearbyCard} onPress={() => router.push({ pathname: '/poi/[id]', params: { id: poi.id } } as any)}>
              {poi.imageUrl ? <Image source={{ uri: poi.imageUrl }} style={styles.nearbyImage} resizeMode="cover" /> : null}
              <View style={styles.nearbyBody}>
                <Text style={styles.nearbyTitle}>{poi.name}</Text>
                <Text style={styles.nearbyMeta}>{poi.subtitle}</Text>
                <Text numberOfLines={2} style={styles.text}>{poi.shortNarrative}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </Section>

      <Section title="Cómo quieres que te acompañe" subtitle="Menos raro, más controlable.">
        <Card>
          <Text style={styles.text}>El paseo evita repeticiones, intenta priorizar lo cercano y se adapta mejor si le dejas el audio automático y el modo caminar activos.</Text>
          {permissionError ? <Text style={styles.error}>{permissionError}</Text> : null}
          <SecondaryButton label="Ajustar experiencia" onPress={() => router.push('/settings')} />
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
  mapFallback: { height: 260, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardMuted, padding: 24, gap: 8 },
  mapEmoji: { fontSize: 42 },
  poiTitle: { fontSize: 21, fontWeight: '900', color: colors.ink },
  nearbyList: { gap: 12 },
  nearbyCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  nearbyImage: { width: 102, height: 102 },
  nearbyBody: { flex: 1, padding: 12, gap: 4, justifyContent: 'center' },
  nearbyTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  nearbyMeta: { color: colors.primaryDark, fontWeight: '700' },
  poiSubtitle: { color: colors.primaryDark, fontWeight: '700' },
  text: { color: colors.inkSoft, lineHeight: 21 },
  helper: { color: colors.primaryDark, fontWeight: '700' },
  buttonGap: { gap: 10 },
  error: { color: colors.danger, fontWeight: '700' },
})
