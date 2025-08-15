import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import Button from './Button';

type Action = {
  label: string;
  onPress: () => void;
  leftIconName?: React.ComponentProps<typeof FontAwesome>['name'];
  variant?: 'primary' | 'secondary';
};

export default function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  illustration = 'chart',
}: {
  title: string;
  description?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  illustration?: 'chart' | 'clipboard';
}) {
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ]),
    ).start();
  }, [float]);

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -4] });

  return (
    <View
      style={{
        flex: 1,
        padding: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View style={{ transform: [{ translateY }] }}>
        {illustration === 'chart' ? <ChartIllustration /> : <ClipboardIllustration />}
      </Animated.View>

      <Text
        style={{
          ...theme.typography.subtitle,
          color: theme.colors.neutral[800],
          textAlign: 'center',
          marginTop: theme.spacing.lg,
        }}
      >
        {title}
      </Text>

      {!!description && (
        <Text
          style={{
            ...theme.typography.body,
            color: theme.colors.neutral[600],
            textAlign: 'center',
            marginTop: theme.spacing.sm,
            lineHeight: 20,
            maxWidth: 320,
          }}
        >
          {description}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          gap: theme.spacing.sm,
          marginTop: theme.spacing.xl,
        }}
      >
        {secondaryAction && (
          <Button
            variant="secondary"
            label={secondaryAction.label}
            onPress={secondaryAction.onPress}
            leftIcon={
              secondaryAction.leftIconName ? (
                <FontAwesome
                  name={secondaryAction.leftIconName}
                  size={16}
                  color={theme.colors.primary[700]}
                  style={{ marginRight: 4 }}
                />
              ) : undefined
            }
          />
        )}

        {primaryAction && (
          <Button
            label={primaryAction.label}
            onPress={primaryAction.onPress}
            leftIcon={
              primaryAction.leftIconName ? (
                <FontAwesome
                  name={primaryAction.leftIconName}
                  size={16}
                  color={theme.colors.text.inverted}
                  style={{ marginRight: 4 }}
                />
              ) : undefined
            }
          />
        )}
      </View>
    </View>
  );
}

function ChartIllustration() {
  return (
    <Svg width={160} height={120} viewBox="0 0 160 120">
      <Rect
        x={8}
        y={18}
        rx={16}
        ry={16}
        width={144}
        height={94}
        fill={theme.colors.surface}
        stroke={theme.colors.neutral[200]}
        strokeWidth={1}
      />
      <Rect x={8} y={18} width={144} height={20} rx={16} ry={16} fill={theme.colors.neutral[50]} />
      <Circle cx={24} cy={28} r={4} fill={theme.colors.primary[500]} />
      <Circle cx={36} cy={28} r={4} fill={theme.colors.secondary[500]} />
      <Circle cx={48} cy={28} r={4} fill={theme.colors.warning[500]} />

      {[0, 1, 2, 3].map((i) => (
        <Rect
          key={i}
          x={20}
          y={44 + i * 16}
          width={120}
          height={1}
          fill={theme.colors.neutral[200]}
          opacity={0.7}
        />
      ))}

      <G>
        {[
          { x: 30, c: theme.colors.secondary[400], h1: 18, h2: 10 },
          { x: 56, c: theme.colors.primary[400], h1: 24, h2: 14 },
          { x: 82, c: theme.colors.warning[400], h1: 32, h2: 16 },
          { x: 108, c: theme.colors.success[400], h1: 20, h2: 12 },
        ].map((b, idx) => (
          <G key={idx}>
            <Rect x={b.x} y={90 - b.h1} width={14} height={b.h1} rx={4} fill={b.c} />
            <Rect
              x={b.x}
              y={90 - (b.h1 + b.h2)}
              width={14}
              height={b.h2}
              rx={4}
              fill={theme.colors.primary[600]}
              opacity={0.85}
            />
          </G>
        ))}
      </G>

      <Path d="M130 52c8 0 8 12 0 12s-8-12 0-12Z" fill={theme.colors.success[500]} opacity={0.25} />
    </Svg>
  );
}

function ClipboardIllustration() {
  return (
    <Svg width={160} height={120} viewBox="0 0 160 120">
      <Rect
        x={40}
        y={18}
        width={80}
        height={94}
        rx={12}
        fill={theme.colors.surface}
        stroke={theme.colors.neutral[200]}
      />
      <Rect x={58} y={12} width={44} height={16} rx={8} fill={theme.colors.primary[500]} />
      <Rect x={52} y={40} width={56} height={8} rx={4} fill={theme.colors.neutral[200]} />
      <Rect x={52} y={56} width={44} height={8} rx={4} fill={theme.colors.neutral[200]} />
      <Rect x={52} y={72} width={52} height={8} rx={4} fill={theme.colors.neutral[200]} />
      <Circle cx={112} cy={72} r={6} fill={theme.colors.success[500]} />
    </Svg>
  );
}
