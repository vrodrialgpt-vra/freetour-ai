import { router } from 'expo-router'
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import { Card, Chip, HeroCard, PrimaryButton, Screen, SecondaryButton, Section } from '../src/components/ui'
import { colors } from '../src/constants/theme'
import { useAppStore } from '../src/store/appStore'

export default function OnboardingScreen() {
  const preferences = useAppStore((state) => state.preferences)
  const updatePreferences = useAppStore((state) => state.updatePreferences)
  const completeOnboarding = useAppStore((state) => state.completeOnboarding)

  return (
    <Screen scroll>
      <HeroCard
        title="Empecemos fácil"
        subtitle="Te dejamos una configuración buena por defecto. Solo toca lo importante y empieza a caminar."
      />

      <Section title="¿Cómo quieres usarla?" subtitle="El MVP evita sobrecarga. Primero lo esencial.">
        <View style={styles.rowWrap}>
          {[
            { label: 'Automática', value: 'auto' },
            { label: 'Manual', value: 'manual' },
          ].map((item) => (
            <Chip key={item.value} label={item.label} active={preferences.audioMode === item.value} onPress={() => updatePreferences({ audioMode: item.value as 'auto' | 'manual' })} />
          ))}
        </View>
      </Section>

      <Section title="Estilo de narración" subtitle="Esto cambia de verdad cómo te habla la app.">
        <View style={styles.rowWrap}>
          {[
            ['dynamic', 'Dinámico'],
            ['classic', 'Clásico'],
            ['family', 'Familiar'],
            ['premium', 'Cultural'],
            ['brief', 'Breve'],
          ].map(([value, label]) => (
            <Chip
              key={value}
              label={label}
              active={preferences.narrativeStyle === value}
              onPress={() => updatePreferences({ narrativeStyle: value as typeof preferences.narrativeStyle })}
            />
          ))}
        </View>
      </Section>

      <Card>
        <Text style={styles.cardTitle}>Permisos con sentido</Text>
        <Text style={styles.cardText}>La ubicación solo se usa para saber qué tienes cerca y poder contártelo en el momento oportuno. Sin eso no existe el modo paseo.</Text>
      </Card>

      <Card style={styles.toggleCard}>
        <View style={styles.toggleHeader}>
          <View>
            <Text style={styles.cardTitle}>Transcripción en pantalla</Text>
            <Text style={styles.cardText}>Útil si vas con ruido, niños o quieres leer rápido.</Text>
          </View>
          <Switch value={preferences.showTranscript} onValueChange={(value) => updatePreferences({ showTranscript: value })} />
        </View>
      </Card>

      <View style={styles.footerActions}>
        <PrimaryButton
          label="Listo, quiero empezar"
          onPress={() => {
            completeOnboarding()
            router.replace('/')
          }}
        />
        <SecondaryButton label="Ver modo paseo" onPress={() => router.replace('/walk')} />
      </View>

      <Pressable onPress={() => updatePreferences({ onboardingMode: 'quick' })}>
        <Text style={styles.skip}>Usar onboarding rápido por defecto en el futuro</Text>
      </Pressable>
    </Screen>
  )
}

const styles = StyleSheet.create({
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  cardText: { color: colors.inkSoft, lineHeight: 20 },
  toggleCard: { paddingVertical: 14 },
  toggleHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center' },
  footerActions: { gap: 12 },
  skip: { textAlign: 'center', color: colors.primary, fontWeight: '700' },
})
