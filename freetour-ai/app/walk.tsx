import { router } from 'expo-router'
import { useState } from 'react'
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { Card, HeroCard, PrimaryButton, Screen, SecondaryButton, Section } from '../src/components/ui'
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

  return (
    <Screen scroll>
      <HeroCard
        title={active ? 'Paseo activo' : 'Modo paseo'}
        subtitle={active ? 'Camina tranquilo. La app te avisará cuando haya algo que merezca la pena.' : 'Actívalo y deja que la ciudad te vaya hablando mientras paseas.'}
        ctaLabel={active ? 'Pausar' : 'Activar paseo'}
        onPress={() => setActive((value) => !value)}
      />

      <Card style={styles.mapCard}>
        {Platform.OS === 'web' ? (
          <View style={styles.mapFallback}>
            <Text style={styles.mapEmoji}>🗺️</Text>
            <Text style={styles.poiTitle}>Mapa de la ruta</Text>
            <Text style={styles.text}>En móvil verás el mapa interactivo. Aquí te mostramos una vista simple para seguir avanzando rápido.</Text>
          </View>
        ) : (
          <NativeMap pois={pois} route={route} initialRegion={city.center} />
        )}
      </Card>

      <Section title="Lo siguiente" subtitle="Lo más cercano y más interesante primero.">
        <Card>
          {leadPoi ? (
            <>
              <Text style={styles.poiTitle}>{leadPoi.name}</Text>
              <Text style={styles.poiSubtitle}>{leadPoi.subtitle}</Text>
              <Text style={styles.text}>{leadPoi.hook}</Text>
              <Text style={styles.helper}>{Math.round(nearby[0].distanceMeters)} m de distancia</Text>
              <View style={styles.buttonGap}>
                <PrimaryButton label="Escuchar ahora" onPress={replayLead} />
                <SecondaryButton label="Ver ficha" onPress={() => router.push({ pathname: '/poi/[id]', params: { id: leadPoi.id } } as any)} />
                {active ? <SecondaryButton label="Pausar paseo" onPress={() => setActive(false)} /> : null}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.poiTitle}>Todavía no hay nada cerca</Text>
              <Text style={styles.text}>Activa el paseo y sigue caminando. Cuando te acerques a un lugar interesante, la app te lo contará.</Text>
            </>
          )}
        </Card>
      </Section>

      <Section title="También tienes cerca" subtitle="Más opciones por si quieres improvisar.">
        <View style={styles.nearbyList}>
          {nearby.slice(0, 3).map((match) => (
            <Pressable key={match.poi.id} style={styles.nearbyCard} onPress={() => router.push({ pathname: '/poi/[id]', params: { id: match.poi.id } } as any)}>
              {match.poi.imageUrl ? <Image source={{ uri: match.poi.imageUrl }} style={styles.nearbyImage} resizeMode="cover" /> : null}
              <View style={styles.nearbyBody}>
                <Text style={styles.nearbyTitle}>{match.poi.name}</Text>
                <Text style={styles.nearbyMeta}>{Math.round(match.distanceMeters)} m · {match.poi.category}</Text>
                <Text numberOfLines={2} style={styles.text}>{match.poi.shortNarrative}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </Section>

      <Section title="Cómo te acompaña" subtitle="Automática, pero con control.">
        <Card>
          <Text style={styles.text}>No repite el mismo punto todo el rato, evita disparar audio si vas demasiado rápido y prioriza los lugares que realmente tienes cerca.</Text>
          {permissionError ? <Text style={styles.error}>{permissionError}</Text> : null}
          <Pressable>
            <Text style={styles.link}>Ajustar experiencia</Text>
          </Pressable>
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
  mapFallback: { height: 260, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAF4FF', padding: 24, gap: 8 },
  mapEmoji: { fontSize: 42 },
  poiTitle: { fontSize: 20, fontWeight: '800', color: colors.ink },
  nearbyList: { gap: 12 },
  nearbyCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  nearbyImage: { width: 96, height: 96 },
  nearbyBody: { flex: 1, padding: 12, gap: 4 },
  nearbyTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  nearbyMeta: { color: colors.primaryDark, fontWeight: '700', textTransform: 'capitalize' },
  poiSubtitle: { color: colors.primaryDark, fontWeight: '700' },
  text: { color: colors.inkSoft, lineHeight: 21 },
  helper: { color: colors.primaryDark, fontWeight: '700' },
  buttonGap: { gap: 10 },
  link: { color: colors.primary, fontWeight: '800' },
  error: { color: colors.danger, fontWeight: '700' },
})
