import { PropsWithChildren, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native'
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
    <LinearGradient colors={['#221C17', '#14110F', '#0F0D0C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
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

export function PoiImage({ uri, emoji = '◆', height = 180, rounded = 24 }: { uri?: string; emoji?: string; height?: number; rounded?: number }) {
  const [failed, setFailed] = useState(false)

  if (!uri || failed) {
    return (
      <LinearGradient colors={['#241F1B', '#191613']} style={[styles.imageFallback, { height, borderRadius: rounded }]}>
        <Text style={styles.imageFallbackEmoji}>{emoji}</Text>
      </LinearGradient>
    )
  }

  return <Image source={{ uri }} style={{ width: '100%', height, borderRadius: rounded }} resizeMode="cover" onError={() => setFailed(true)} />
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
  scroll: { paddingBottom: spacing.xl + 16 },
  screen: { flex: 1, backgroundColor: colors.sand, padding: spacing.md, gap: spacing.xl },
  hero: {
    borderRadius: 30,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#2C251F',
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  heroEyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
  heroTitle: { color: colors.ink, fontSize: 34, fontWeight: '900', lineHeight: 38 },
  heroSubtitle: { color: colors.inkSoft, fontSize: 15, lineHeight: 23 },
  cta: { alignSelf: 'flex-start', backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, marginTop: 8 },
  ctaText: { color: '#0F0D0C', fontWeight: '900', letterSpacing: 0.3 },
  imageFallback: { width: '100%', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  imageFallbackEmoji: { fontSize: 36, color: colors.primary },
  section: { gap: spacing.sm },
  sectionHead: { gap: 4 },
  sectionTitle: { fontSize: 26, fontWeight: '900', color: colors.ink },
  sectionSubtitle: { fontSize: 14, color: colors.inkMuted, lineHeight: 21 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 26,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 30, paddingHorizontal: 16, gap: 10 },
  emptyEmoji: { fontSize: 30, color: colors.primary },
  emptyTitle: { fontSize: 21, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  emptySubtitle: { fontSize: 15, lineHeight: 22, color: colors.inkSoft, textAlign: 'center' },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.cardMuted, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: '#2A2117', borderColor: '#4B3920' },
  chipText: { color: colors.inkSoft, fontWeight: '700' },
  chipTextActive: { color: colors.primary },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: 15, alignItems: 'center', borderRadius: 18 },
  primaryButtonText: { color: '#0E0C0B', fontWeight: '900', fontSize: 16 },
  secondaryButton: { backgroundColor: colors.cardMuted, paddingVertical: 15, alignItems: 'center', borderRadius: 18, borderWidth: 1, borderColor: colors.border },
  secondaryButtonText: { color: colors.ink, fontWeight: '700', fontSize: 16 },
})
