import { StyleSheet, Switch, Text, View } from 'react-native'
import { Card, Chip, HeroCard, Screen, Section } from '../src/components/ui'
import { colors } from '../src/constants/theme'
import { useAppStore } from '../src/store/appStore'

export default function SettingsScreen() {
  const preferences = useAppStore((state) => state.preferences)
  const updatePreferences = useAppStore((state) => state.updatePreferences)

  return (
    <Screen scroll>
      <HeroCard title="Tu experiencia" subtitle="Cambia idioma, audio y estilo para que la visita se sienta más tuya." />

      <Section title="Contenido" subtitle="Lo que escuchas y cómo te lo cuenta.">
        <Card>
          <Text style={styles.label}>Idioma</Text>
          <View style={styles.rowWrap}>
            <Chip label="Español" active={preferences.language === 'es'} onPress={() => updatePreferences({ language: 'es' })} />
            <Chip label="English" active={preferences.language === 'en'} onPress={() => updatePreferences({ language: 'en' })} />
          </View>

          <Text style={styles.label}>Profundidad</Text>
          <View style={styles.rowWrap}>
            <Chip label="Muy breve" active={preferences.depth === 'short'} onPress={() => updatePreferences({ depth: 'short' })} />
            <Chip label="Estándar" active={preferences.depth === 'standard'} onPress={() => updatePreferences({ depth: 'standard' })} />
            <Chip label="Ampliado" active={preferences.depth === 'expanded'} onPress={() => updatePreferences({ depth: 'expanded' })} />
          </View>
        </Card>
      </Section>

      <Section title="Audio" subtitle="Más automático o más manual, como prefieras.">
        <Card>
          <ToggleRow title="Audio automático" value={preferences.audioMode === 'auto'} onChange={(value) => updatePreferences({ audioMode: value ? 'auto' : 'manual' })} />
          <ToggleRow title="Ver texto en pantalla" value={preferences.showTranscript} onChange={(value) => updatePreferences({ showTranscript: value })} />
          <ToggleRow title="Vibrar antes de empezar" value={preferences.vibrateBeforeNarration} onChange={(value) => updatePreferences({ vibrateBeforeNarration: value })} />
        </Card>
      </Section>

      <Section title="Detección" subtitle="Para que la app acierte mejor mientras caminas.">
        <Card>
          <Text style={styles.label}>Sensibilidad</Text>
          <View style={styles.rowWrap}>
            {['strict', 'balanced', 'flexible'].map((value) => (
              <Chip
                key={value}
                label={value === 'strict' ? 'Estricto' : value === 'balanced' ? 'Equilibrado' : 'Flexible'}
                active={preferences.detectionSensitivity === value}
                onPress={() => updatePreferences({ detectionSensitivity: value as typeof preferences.detectionSensitivity })}
              />
            ))}
          </View>
          <ToggleRow title="No repetir lugares ya escuchados" value={preferences.avoidRepeats} onChange={(value) => updatePreferences({ avoidRepeats: value })} />
          <ToggleRow title="Solo cuando voy andando" value={preferences.onlyWhenWalking} onChange={(value) => updatePreferences({ onlyWhenWalking: value })} />
        </Card>
      </Section>

      <Section title="Ruta" subtitle="Más corta o más rica en contenido.">
        <Card>
          <View style={styles.rowWrap}>
            <Chip label="Más corta" active={preferences.routePreference === 'shorter'} onPress={() => updatePreferences({ routePreference: 'shorter' })} />
            <Chip label="Más rica" active={preferences.routePreference === 'richer'} onPress={() => updatePreferences({ routePreference: 'richer' })} />
          </View>
          <ToggleRow title="Añadir paradas gastronómicas" value={preferences.includeFoodStops} onChange={(value) => updatePreferences({ includeFoodStops: value })} />
        </Card>
      </Section>
    </Screen>
  )
}

function ToggleRow({ title, value, onChange }: { title: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleText}>{title}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  )
}

const styles = StyleSheet.create({
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  label: { fontSize: 15, fontWeight: '800', color: colors.ink, marginTop: 6 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingVertical: 4 },
  toggleText: { flex: 1, color: colors.inkSoft, lineHeight: 20 },
})
