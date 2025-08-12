import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  backButton?: boolean;
  right?: React.ReactNode;
  variant?: 'default' | 'large';
  elevated?: boolean;
  withBorder?: boolean;
};

export default function AppHeader({
  title,
  subtitle,
  backButton,
  right,
  variant = 'default',
  elevated = false,
  withBorder = true,
}: AppHeaderProps) {
  const router = useRouter();
  const isLarge = variant === 'large';

  return (
    <View
      style={{
        paddingTop: Platform.OS === 'ios' ? 44 : 12,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: withBorder ? 1 : 0,
        borderBottomColor: theme.colors.border,
        ...(elevated ? theme.shadow.level1 : null),
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: isLarge ? 12 : 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {backButton ? (
          <Pressable
            onPress={() => router.back()}
            hitSlop={theme.hitSlop}
            style={{ marginRight: 8, padding: 6, borderRadius: theme.radii.md }}
          >
            <FontAwesome name="chevron-left" size={18} color={theme.colors.text.primary} />
          </Pressable>
        ) : null}

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: theme.typography.family.bold,
              fontSize: isLarge ? 24 : 18,
              lineHeight: isLarge ? 30 : 24,
              color: theme.colors.text.primary,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={{
                marginTop: 2,
                fontFamily: theme.typography.family.regular,
                fontSize: 12,
                color: theme.colors.text.secondary,
              }}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        {right ? <View style={{ marginLeft: 8, flexDirection: 'row' }}>{right}</View> : null}
      </View>
    </View>
  );
}
