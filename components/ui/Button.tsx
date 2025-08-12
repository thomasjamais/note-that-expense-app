import { rgba, theme } from '@/theme';
import { Pressable, Text, TextStyle, ViewStyle } from 'react-native';

type Props = {
  label: string;
  variant?: 'primary' | 'secondary' | 'soft' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
};

const sizes = {
  sm: { h: 36, px: 12, gap: 6, fs: 14 },
  md: { h: 44, px: 16, gap: 8, fs: 15 },
  lg: { h: 52, px: 18, gap: 10, fs: 16 },
};

const getStyles = (variant: Props['variant'], disabled?: boolean) => {
  const dis = disabled;
  const prim = theme.colors.primary[600];
  const sec = theme.colors.secondary[600];
  const err = theme.colors.danger[600];

  switch (variant) {
    case 'primary':
      return {
        bg: dis ? theme.colors.neutral[300] : prim,
        fg: theme.colors.text.inverted,
        bgPressed: rgba(prim, 0.88),
        border: 'transparent',
      };
    case 'secondary':
      return {
        bg: dis ? theme.colors.neutral[200] : sec,
        fg: theme.colors.text.inverted,
        bgPressed: rgba(sec, 0.88),
        border: 'transparent',
      };
    case 'destructive':
      return {
        bg: dis ? theme.colors.neutral[300] : err,
        fg: theme.colors.text.inverted,
        bgPressed: rgba(err, 0.88),
        border: 'transparent',
      };
    case 'soft': {
      const tint = theme.colors.primary[600];
      return {
        bg: dis ? theme.colors.neutral[100] : rgba(tint, 0.12),
        fg: tint,
        bgPressed: rgba(tint, 0.18),
        border: 'transparent',
      };
    }
    case 'link':
    default:
      return {
        bg: 'transparent',
        fg: theme.colors.primary[700],
        bgPressed: rgba(theme.colors.primary[600], 0.08),
        border: 'transparent',
      };
  }
};

export default function Button({
  label,
  variant = 'primary',
  size = 'md',
  disabled,
  leftIcon,
  style,
  onPress,
}: Props) {
  const s = sizes[size];
  const v = getStyles(variant, disabled);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          height: s.h,
          paddingHorizontal: s.px,
          borderRadius: theme.radii.md,
          backgroundColor: pressed ? v.bgPressed : v.bg,
          borderWidth: v.border === 'transparent' ? 0 : 1,
          borderColor: v.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? theme.opacity.disabled : 1,
          ...theme.shadow.level1,
        } as ViewStyle,
        style,
      ]}
      hitSlop={theme.hitSlop}
    >
      {leftIcon ? (
        <>
          {leftIcon}
          <Text style={{ width: s.gap }} />
        </>
      ) : null}
      <Text
        style={
          {
            color: v.fg,
            fontFamily: theme.typography.family.medium,
            fontSize: s.fs,
          } as TextStyle
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
