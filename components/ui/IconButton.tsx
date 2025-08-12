import { rgba, theme } from '@/theme';
import React from 'react';
import { Pressable, ViewStyle } from 'react-native';

type IconButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  variant?: 'soft' | 'link';
};

export default function IconButton({
  children,
  onPress,
  style,
  disabled,
  variant = 'soft',
}: IconButtonProps) {
  const bg = variant === 'soft' ? rgba(theme.colors.primary[600], 0.12) : 'transparent';
  const bgPressed =
    variant === 'soft'
      ? rgba(theme.colors.primary[600], 0.18)
      : rgba(theme.colors.primary[600], 0.08);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={theme.hitSlop}
      style={({ pressed }) => [
        {
          width: 36,
          height: 36,
          borderRadius: theme.radii.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? bgPressed : bg,
          marginLeft: 6,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}
