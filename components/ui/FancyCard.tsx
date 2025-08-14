import { rgba, theme } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

type FancyCardProps = {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'gradient' | 'glass' | 'outline';
  compact?: boolean;
  minHeight?: number;
};

export default function FancyCard({
  title,
  subtitle,
  right,
  children,
  onPress,
  style,
  variant = 'elevated',
  compact = false,
  minHeight,
}: FancyCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

  const PADDING_H = compact ? theme.spacing.md : theme.spacing.lg;
  const PADDING_V = (compact ? theme.spacing.md : theme.spacing.lg) + 4;
  const MIN_HEIGHT = minHeight ?? (compact ? 96 : 110);

  const bg =
    variant === 'glass'
      ? rgba('#FFFFFF', 0.7)
      : variant === 'gradient'
        ? 'transparent'
        : theme.colors.surface;

  const borderWidth = variant === 'outline' ? 1 : 0;
  const borderColor = variant === 'outline' ? theme.colors.primary[100] : 'transparent';

  const cardShadow =
    variant === 'elevated' || variant === 'gradient'
      ? theme.shadow.level2
      : variant === 'glass'
        ? theme.shadow.level1
        : {};

  const Content = (
    <View style={{ paddingHorizontal: PADDING_H, paddingVertical: PADDING_V }}>
      {(title || right) && (
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: children ? 8 : 0 }}
        >
          {title ? (
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: theme.typography.family.bold,
                  fontSize: 16,
                  color: theme.colors.text.primary,
                }}
                numberOfLines={1}
              >
                {title}
              </Text>
              {!!subtitle && (
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
              )}
            </View>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {!!right && <View style={{ marginLeft: 8 }}>{right}</View>}
        </View>
      )}
      {children}
    </View>
  );

  const Card = (
    <Animated.View
      style={[
        {
          transform: [{ scale }],
          width: '100%',
          minHeight: MIN_HEIGHT,
          borderRadius: theme.radii.xl,
          backgroundColor: bg,
          borderWidth,
          borderColor,
          overflow: 'hidden',
        },
        cardShadow,
      ]}
    >
      {variant === 'glass' && (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', inset: 0, backgroundColor: rgba('#FFFFFF', 0.25) }}
        />
      )}
      {Content}
    </Animated.View>
  );

  const WithGradient =
    variant === 'gradient' ? (
      <LinearGradient
        colors={[theme.colors.primary[100], theme.colors.secondary[100]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: theme.radii.xl + 1, overflow: 'hidden' }}
      >
        {Card}
      </LinearGradient>
    ) : (
      Card
    );

  return (
    <Pressable
      onPress={onPress || (() => {})}
      onPressIn={pressIn}
      onPressOut={pressOut}
      android_ripple={{ color: rgba(theme.colors.primary[200], 0.15) }}
      style={[
        {
          borderRadius: theme.radii.xl,
          alignSelf: 'stretch',
        },
        style,
      ]}
    >
      {WithGradient}
    </Pressable>
  );
}
