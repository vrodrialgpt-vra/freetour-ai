import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { Card, HeroCard, PrimaryButton, Screen, SecondaryButton, Section } from '../src/components/ui'
import { colors } from '../src/constants/theme'
import { cities } from '../src/data/pois'
import { useWalkingGuide } from '../src/hooks/useWalkingGuide'
import { useAppStore } from '../src/store/appStore'

export default function WalkScreen() {
  const [active, setActive] = useState(false)
  const { nearby, leadPoi, permissionError, replayLead } = useWalkingGuide(active)
  const preferences = useAppStore((state) => state.preferences)
  const route = useAppStore((state) => state.activeRoute)
  const pois = useAppStore((state) => state.pois)
  const city = cities[0]

  return (
    <Screen scroll>
      <HeroCard
        title="Modo paseo"
        subtitle="Tu flujo principal: abrir, activar y caminar. La app hace el resto sin freírte a toques."
        ctaLabel={active ? 'Pausar paseo' : 'Activar paseo'}
        onPress={() => setActive((value) => !value)}
      />

      <Card style={styles.mapCard}>
        <MapView style={styles.map} initialRegion={city.center}>
          {pois.map((poi) => (
            <Marker key={poi.id} coordinate={{ latitude: poi.latitude, longitude: poi.longitude }} title={poi.name} description={poi.subtitle} />
          ))}
          {route ? (
            <Polyline
              coordinates={route.stops
                .map((stop) => pois.find((poi) => poi.id === stop.poiId))
                .filter(Boolean)
                .map((poi) => ({ latitude: poi!.latitude, longitude: poi!.longitude }))}
              strokeColor={colors.mapRoute}
              strokeWidth={4}
            />
          ) : null}
        </MapView>
      </Card>

      <Section title="Estado ahora" subtitle="Información pensada para mirar poco rato mientras paseas.">
        <Card>
          <StatusRow label="Ciudad" value={city.name} />
          <StatusRow label="Audio" value={preferences.audioMode === 'auto' ? 'Automático' : 'Manual'} />
          <StatusRow label="Detección" value={preferences.detectionSensitivity} />
          <StatusRow label="Puntos cerca" value={`${nearby.length}`} />
          {permissionError ? <Text style={styles.error}>{permissionError}</Text> : null}
        </Card>
      </Section>

      <Section title="Siguiente historia" subtitle="La app detecta el mejor punto cercano y evita repeticiones molestas.">
        <Card>
          {leadPoi ? (
            <>
              <Text style={styles.poiTitle}>{leadPoi.name}</Text>
              <Text style={styles.poiSubtitle}>{leadPoi.subtitle}</Text>
              <Text style={styles.cardText}>{leadPoi.hook}</Text>
              <Text style={styles.helper}>{Math.round(nearby[0].distanceMeters)} m · radio dinámico según tus preferencias</Text>
              <View style={styles.rowButtons}>
                <PrimaryButton label="Reproducir ahora" onPress={replayLead} />
                <SecondaryButton label="Pausar paseo" onPress={() => setActive(false)} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.poiTitle}>Nada cerca todavía</Text>
              <Text style={styles.cardText}>Si todavía no has arrancado, activa el modo paseo. Si ya vas andando, la app esperará a que estés realmente cerca de algo que merezca la pena.</Text>
            </>
          )}
        </Card>
      </Section>

      <Section title="Control y confianza" subtitle="Automática no significa invasiva.">
        <Card>
          <Text style={styles.cardText}>El audio solo salta si el punto es relevante, estás lo bastante cerca y no vas demasiado rápido. Si ya lo escuchaste, no repite salvo que tú quieras.</Text>
          <Pressable>
            <Text style={styles.link}>Esto se puede afinar en ajustes</Text>
          </Pressable>
        </Card>
      </Section>
    </Screen>
  )
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={styles.statusValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  mapCard: { padding: 0, overflow: 'hidden' },
  map: { height: 260, borderRadius: 18 },
  cardText: { color: colors.inkSoft, lineHeight: 21 },
  error: { color: colors.danger, fontWeight: '700' },
  poiTitle: { fontSize: 20, fontWeight: '800', color: colors.ink },
  poiSubtitle: { color: colors.primaryDark, fontWeight: '700' },
  helper: { color: colors.inkSoft, fontSize: 13 },
  rowButtons: { gap: 10 },
  link: { color: colors.primary, fontWeight: '700' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  statusLabel: { color: colors.inkSoft },
  statusValue: { color: colors.ink, fontWeight: '800', textTransform: 'capitalize' },
})
