import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { Card, Chip, HeroCard, Screen, Section } from '../src/components/ui'
import { colors } from '../src/constants/theme'
import { useAppStore } from '../src/store/appStore'

export default function SettingsScreen() {
  const preferences = useAppStore((state) => state.preferences)
  const updatePreferences = useAppStore((state) => state.updatePreferences)

  return (
    <Screen scroll>
      <HeroCard title="Tu experiencia" subtitle="La configuración es estratégica: cambia de verdad lo que oyes, cuándo salta y cómo te acompaña la app." />

      <Section title="Contenido" subtitle="En MVP incluimos lo que impacta más en la experiencia real.">
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

      <Section title="Audio" subtitle="Controlar sin complicar.">
        <Card>
          <ToggleRow title="Audio automático" value={preferences.audioMode === 'auto'} onChange={(value) => updatePreferences({ audioMode: value ? 'auto' : 'manual' })} />
          <ToggleRow title="Ver transcripción" value={preferences.showTranscript} onChange={(value) => updatePreferences({ showTranscript: value })} />
          <ToggleRow title="Vibrar antes de narrar" value={preferences.vibrateBeforeNarration} onChange={(value) => updatePreferences({ vibrateBeforeNarration: value })} />
        </Card>
      </Section>

      <Section title="Detección GPS" subtitle="Reglas pensadas para evitar disparos torpes o repetidos.">
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
          <ToggleRow title="No repetir puntos ya escuchados" value={preferences.avoidRepeats} onChange={(value) => updatePreferences({ avoidRepeats: value })} />
          <ToggleRow title="Solo cuando detecte que caminas" value={preferences.onlyWhenWalking} onChange={(value) => updatePreferences({ onlyWhenWalking: value })} />
        </Card>
      </Section>

      <Section title="Ruta" subtitle="El MVP incluye solo los ajustes con más retorno de valor.">
        <Card>
          <Text style={styles.label}>Prioridad de ruta</Text>
          <View style={styles.rowWrap}>
            <Chip label="Más corta" active={preferences.routePreference === 'shorter'} onPress={() => updatePreferences({ routePreference: 'shorter' })} />
            <Chip label="Más rica" active={preferences.routePreference === 'richer'} onPress={() => updatePreferences({ routePreference: 'richer' })} />
          </View>
          <ToggleRow title="Añadir paradas gastronómicas" value={preferences.includeFoodStops} onChange={(value) => updatePreferences({ includeFoodStops: value })} />
          <ToggleRow title="Recalcular si me desvío" value={preferences.autoRecalculateRoute} onChange={(value) => updatePreferences({ autoRecalculateRoute: value })} />
        </Card>
      </Section>

      <Section title="Accesibilidad y uso" subtitle="Simpleza visible en la calle.">
        <Card>
          <ToggleRow title="Subtítulos siempre visibles" value={preferences.subtitlesAlwaysOn} onChange={(value) => updatePreferences({ subtitlesAlwaysOn: value })} />
          <ToggleRow title="Navegación simplificada" value={preferences.simplifiedNavigation} onChange={(value) => updatePreferences({ simplifiedNavigation: value })} />
          <ToggleRow title="Alto contraste" value={preferences.highContrast} onChange={(value) => updatePreferences({ highContrast: value })} />
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
