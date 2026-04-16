import { PropsWithChildren } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native'
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
    <LinearGradient colors={[colors.primary, '#7D8BFF', '#9EE6DB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
      <View style={styles.heroBadge}>
        <Text style={styles.heroEyebrow}>FreeTour AI</Text>
      </View>
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
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  )
}

export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.card, style]}>{children}</View>
}

export function EmptyState({ emoji, title, subtitle, action }: { emoji: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      {action}
    </View>
  )
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
  scroll: { paddingBottom: spacing.xl + 12 },
  screen: { flex: 1, backgroundColor: colors.sand, padding: spacing.md, gap: spacing.lg },
  hero: {
    borderRadius: 28,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroEyebrow: { color: 'rgba(255,255,255,0.95)', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6 },
  heroTitle: { color: '#fff', fontSize: 30, fontWeight: '900', lineHeight: 34 },
  heroSubtitle: { color: 'rgba(255,255,255,0.92)', fontSize: 15, lineHeight: 22 },
  cta: { alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, marginTop: 6 },
  ctaText: { color: colors.primaryDark, fontWeight: '800' },
  section: { gap: spacing.sm },
  sectionHead: { gap: 3 },
  sectionTitle: { fontSize: 24, fontWeight: '900', color: colors.ink },
  sectionSubtitle: { fontSize: 14, color: colors.inkMuted, lineHeight: 20 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    gap: 8,
  },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  emptySubtitle: { fontSize: 15, lineHeight: 21, color: colors.inkSoft, textAlign: 'center' },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.cardMuted, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: '#ECEFFF', borderColor: '#CCD4FF' },
  chipText: { color: colors.inkSoft, fontWeight: '700' },
  chipTextActive: { color: colors.primaryDark },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: 15, alignItems: 'center', borderRadius: 16 },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  secondaryButton: { backgroundColor: colors.cardMuted, paddingVertical: 15, alignItems: 'center', borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  secondaryButtonText: { color: colors.ink, fontWeight: '700', fontSize: 16 },
})
