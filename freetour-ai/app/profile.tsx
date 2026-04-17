import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { BottomNav, Card, Field, Pill, Screen, SmallButton, Subtitle, Title } from '../src/components/GameUI'
import { useGameStore } from '../src/store/gameStore'

export default function ProfileScreen() {
  const { profile, settings, flags, resetGame, toggleSetting, unlockAdmin, setScreen } = useGameStore((s) => ({
    profile: s.profile,
    settings: s.settings,
    flags: s.flags,
    resetGame: s.resetGame,
    toggleSetting: s.toggleSetting,
    unlockAdmin: s.unlockAdmin,
    setScreen: s.setScreen,
  }))
  const [secretTaps, setSecretTaps] = useState(0)
  const [code, setCode] = useState('')

  const tryUnlock = () => {
    const next = secretTaps + 1
    setSecretTaps(next)
    if (next >= 5 || code.toLowerCase() === 'oak') {
      unlockAdmin()
      setScreen('admin')
      router.push('/admin' as never)
    }
  }

  return (
    <Screen>
      <Card color={profile.avatarHue}>
        <Pressable onLongPress={tryUnlock} delayLongPress={400} style={[styles.avatar, { backgroundColor: profile.avatarHue }]}>
          <Text style={styles.avatarText}>{profile.name?.slice(0, 1) || 'A'}</Text>
        </Pressable>
        <Pill label="Trainer card" color={profile.avatarHue} />
        <Title>{profile.name}</Title>
        <Subtitle>Age {profile.age} · Starter {profile.starter}</Subtitle>
      </Card>

      <Card color="#61B7FF">
        <Title>Settings</Title>
        <View style={styles.settingRow}><Text style={styles.settingLabel}>Sound effects</Text><SmallButton label={settings.soundOn ? 'ON' : 'OFF'} onPress={() => toggleSetting('soundOn')} /></View>
        <View style={styles.settingRow}><Text style={styles.settingLabel}>Voice cheer</Text><SmallButton label={settings.voiceOn ? 'ON' : 'OFF'} onPress={() => toggleSetting('voiceOn')} /></View>
        <View style={styles.settingRow}><Text style={styles.settingLabel}>Haptics</Text><SmallButton label={settings.hapticsOn ? 'ON' : 'OFF'} onPress={() => toggleSetting('hapticsOn')} /></View>
      </Card>

      <Card color="#F9A8D4">
        <Title>Hidden cabin</Title>
        <Subtitle>Hold the avatar a few times, or type the secret helper word.</Subtitle>
        <Field value={code} onChangeText={setCode} placeholder="secret word" />
        <SmallButton label={flags.adminUnlocked ? 'Open admin' : 'Try secret'} onPress={tryUnlock} color="#F9A8D4" textColor="#1C2340" />
        <SmallButton label="Start fresh adventure" onPress={resetGame} color="#FF8A5C" />
      </Card>

      <BottomNav
        active="profile"
        items={[
          { key: 'world', label: 'Map', onPress: () => { setScreen('world'); router.replace('/world' as never) } },
          { key: 'battle', label: 'Battle', onPress: () => { setScreen('battle'); router.replace('/battle' as never) } },
          { key: 'team', label: 'Team', onPress: () => { setScreen('team'); router.replace('/team' as never) } },
          { key: 'bag', label: 'Bag', onPress: () => { setScreen('bag'); router.replace('/bag' as never) } },
          { key: 'profile', label: 'Profile', onPress: () => {} },
        ]}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  avatar: { width: 86, height: 86, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 38, fontWeight: '900', color: '#102038' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  settingLabel: { color: '#fff', fontWeight: '800', flex: 1 },
})
