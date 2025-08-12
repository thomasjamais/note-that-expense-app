import { theme } from '@/theme';
import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

export type InputProps = TextInputProps & { left?: React.ReactNode; right?: React.ReactNode };

export const Input: React.FC<InputProps> = ({ left, right, style, ...rest }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.neutral[200],
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radii.md,
        paddingHorizontal: theme.spacing.md,
        height: 48,
      }}
    >
      {left}
      <TextInput
        placeholderTextColor={theme.colors.text.muted}
        style={[
          {
            flex: 1,
            paddingVertical: 0,
            fontSize: 16,
            color: theme.colors.text.primary,
          },
          style,
        ]}
        {...rest}
      />
      {right}
    </View>
  );
};
