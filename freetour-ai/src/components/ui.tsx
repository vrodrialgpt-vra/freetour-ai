import { PropsWithChildren } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, spacing } from '../constants/theme'

export function Screen({ children, scroll = false }: PropsWithChildren<{ scroll?: boolean }>) {
  const content = <View style={styles.screen}>{children}</View>
  if (scroll) {
    return (
      <ScrollView style={styles.fill} contentContainerStyle={styles.scroll}>
        {content}
      </ScrollView>
    )
  }
  return content
}

export function HeroCard({ title, subtitle, ctaLabel, onPress }: { title: string; subtitle: string; ctaLabel?: string; onPress?: () => void }) {
  return (
    <LinearGradient colors={["#0C6CF2", "#2EC4B6"]} style={styles.hero}>
      <Text style={styles.heroEyebrow}>FreeTour AI</Text>
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroSubtitle}>{subtitle}</Text>
      {ctaLabel && onPress ? (
        <Pressable style={styles.cta} onPress={onPress}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </Pressable>
      ) : null}
    </LinearGradient>
  )
}

export function Section({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  )
}

export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.card, style]}>{children}</View>
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  )
}

export function PrimaryButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  )
}

export function SecondaryButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.secondaryButton} onPress={onPress}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.sand },
  scroll: { paddingBottom: spacing.xl },
  screen: { flex: 1, backgroundColor: colors.sand, padding: spacing.md, gap: spacing.md },
  hero: { borderRadius: 24, padding: spacing.lg, gap: spacing.sm },
  heroEyebrow: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  heroSubtitle: { color: '#EFF8FF', fontSize: 15, lineHeight: 22 },
  cta: { alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999 },
  ctaText: { color: colors.primaryDark, fontWeight: '800' },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sectionSubtitle: { fontSize: 14, color: colors.inkSoft, lineHeight: 20 },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.cardMuted, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: '#E7F1FF', borderColor: '#BCD7FF' },
  chipText: { color: colors.inkSoft, fontWeight: '700' },
  chipTextActive: { color: colors.primaryDark },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: 14, alignItems: 'center', borderRadius: 16 },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  secondaryButton: { backgroundColor: colors.card, paddingVertical: 14, alignItems: 'center', borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  secondaryButtonText: { color: colors.ink, fontWeight: '700', fontSize: 16 },
})
