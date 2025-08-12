import { theme } from '@/theme';
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

export function Field({
  label,
  children,
  helper,
  style,
}: {
  label?: string;
  children: React.ReactNode;
  helper?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[{ marginTop: theme.spacing.md }, style]}>
      {label ? (
        <Text
          style={{
            fontSize: 14,
            lineHeight: 18,
            fontWeight: '600',
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xs,
          }}
        >
          {label}
        </Text>
      ) : null}
      {children}
      {helper ? (
        <Text
          style={{
            marginTop: theme.spacing.xs,
            fontSize: 12,
            color: theme.colors.text.secondary,
          }}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
}
