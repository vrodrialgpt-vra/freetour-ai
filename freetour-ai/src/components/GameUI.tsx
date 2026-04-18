import { ReactNode } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

export function Screen({ children }: { children: ReactNode }) {
  return (
    <LinearGradient colors={['#182343', '#101427', '#0A0D18']} style={styles.screen}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>{children}</ScrollView>
    </LinearGradient>
  )
}

export function Card({ children, color = '#253056' }: { children: ReactNode; color?: string }) {
  return <View style={[styles.card, { borderColor: color }]}>{children}</View>
}

export function Title({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>
}

export function Subtitle({ children }: { children: ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>
}

export function Pill({ label, color = '#6DDC7B' }: { label: string; color?: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  )
}

export function BigButton({ label, onPress, color = '#5D7CFF', disabled = false }: { label: string; onPress: () => void; color?: string; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, { backgroundColor: disabled ? '#55607E' : color, opacity: disabled ? 0.5 : pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  )
}

export function SmallButton({ label, onPress, color = '#2C365A', textColor = '#F8FAFF' }: { label: string; onPress: () => void; color?: string; textColor?: string }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.smallButton, { backgroundColor: color, opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
      <Text style={[styles.smallButtonText, { color: textColor }]}>{label}</Text>
    </Pressable>
  )
}

export function Field({ value, onChangeText, placeholder, width = '100%' }: { value: string; onChangeText: (text: string) => void; placeholder: string; width?: number | `${number}%` | '100%' }) {
  return <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#A8B3D9" style={[styles.field, { width }]} />
}

export function StatBar({ value, max, color = '#6DDC7B' }: { value: number; max: number; color?: string }) {
  const pct = Math.max(0, Math.min(1, max ? value / max : 0))
  return (
    <View style={styles.barShell}>
      <View style={[styles.barFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
    </View>
  )
}

export function BottomNav({ items, active }: { items: { key: string; label: string; onPress: () => void; disabled?: boolean }[]; active: string }) {
  return (
    <View style={styles.nav}>
      {items.map((item) => (
        <Pressable key={item.key} disabled={item.disabled} onPress={item.onPress} style={({ pressed }) => [styles.navItem, active === item.key && styles.navItemActive, item.disabled && styles.navItemDisabled, pressed && !item.disabled && styles.navItemPressed]}>
          <Text style={[styles.navText, item.disabled && styles.navTextDisabled]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: 18, paddingBottom: 140, gap: 14 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    borderRadius: 24,
    padding: 16,
    gap: 10,
  },
  title: { color: '#F8FAFF', fontSize: 28, fontWeight: '900' },
  subtitle: { color: '#CCD7FF', fontSize: 15, lineHeight: 22 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  pillText: { color: '#07111E', fontWeight: '900', fontSize: 12 },
  button: { borderRadius: 20, paddingVertical: 16, alignItems: 'center', minHeight: 56, justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  smallButton: { borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', minHeight: 48, flex: 1 },
  smallButtonText: { fontWeight: '800', fontSize: 14 },
  field: { backgroundColor: '#F1F5FF', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, color: '#11203B', fontWeight: '700', fontSize: 16 },
  barShell: { height: 12, borderRadius: 999, backgroundColor: '#293250', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  nav: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 16,
    borderRadius: 24,
    backgroundColor: '#0E1325',
    borderWidth: 1,
    borderColor: '#24304F',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  navItem: { minWidth: '18%', flexGrow: 1, paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
  navItemActive: { backgroundColor: '#243868' },
  navItemPressed: { opacity: 0.88 },
  navItemDisabled: { opacity: 0.4 },
  navText: { color: '#ECF2FF', fontWeight: '800', fontSize: 12 },
  navTextDisabled: { color: '#94A3C7' },
})
