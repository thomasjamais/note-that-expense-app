import { theme } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LoginScreen from './Login';
import RegisterScreen from './Register';

type Mode = 'login' | 'register';

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');

  const logo = require('../../assets/images/new-icon.png');

  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient
        colors={[theme.colors.primary[500], theme.colors.secondary[500]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.brand}>NoteThatExpense</Text>
        <Text style={styles.tagline}>Suivez vos dépenses. Gardez le contrôle.</Text>
      </LinearGradient>

      <View style={styles.logoBadgeWrapper}>
        <View style={styles.logoBadge}>
          <Image source={logo} style={styles.logoImg} resizeMode="contain" />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.segment}>
            <SegmentTab
              label="Connexion"
              active={mode === 'login'}
              onPress={() => setMode('login')}
            />
            <SegmentTab
              label="Inscription"
              active={mode === 'register'}
              onPress={() => setMode('register')}
            />
          </View>

          <View style={styles.card}>{mode === 'login' ? <LoginScreen /> : <RegisterScreen />}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SegmentTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.segmentTab,
        active && { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary[200] },
      ]}
    >
      <Text
        style={[
          styles.segmentLabel,
          active
            ? { color: theme.colors.primary[700], fontFamily: theme.typography.family.bold }
            : { color: theme.colors.neutral[600] },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const HERO_HEIGHT = 180;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  hero: {
    height: HERO_HEIGHT / 1.2,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.xxl * 1.5,
  },
  brand: {
    fontFamily: theme.typography.family.bold,
    fontSize: 22,
    color: theme.colors.text.inverted,
  },
  tagline: {
    marginTop: 6,
    fontFamily: theme.typography.family.regular,
    fontSize: 14,
    color: theme.colors.primary[50],
  },

  logoBadgeWrapper: {
    alignItems: 'center',
    marginTop: -40,
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary[100],
    ...theme.shadow.level3,
  },
  logoImg: {
    width: 64,
    height: 64,
  },

  content: {
    padding: 16,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.radii.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    alignSelf: 'center',
    gap: 4,
  },
  segmentTab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 130,
    alignItems: 'center',
  },
  segmentLabel: {
    fontFamily: theme.typography.family.medium,
    fontSize: 14,
  },

  card: {
    marginTop: 16,
  },
});
