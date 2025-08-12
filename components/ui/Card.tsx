import { theme } from '@/theme';
import React from 'react';
import { View, ViewStyle } from 'react-native';

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          ...theme.shadow.level1,
          elevation: theme.shadow.elevation[1],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
