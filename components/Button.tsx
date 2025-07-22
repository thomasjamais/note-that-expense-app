import Colors from '@/constants/Colors';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  variant?: Variant;
};

const variantColors: Record<Variant, { background: string; text: string }> = {
  default: { background: Colors.light.tint, text: '#fff' },
  success: { background: '#A8E6CF', text: '#064420' }, // Pastel vert
  warning: { background: '#FFD580', text: '#6B4E00' }, // Pastel orange
  error: { background: '#FFB3B3', text: '#660000' }, // Pastel rouge
  info: { background: '#AECBFA', text: '#083D77' }, // Pastel bleu
};

export default function Button({
  title,
  onPress,
  disabled = false,
  style,
  variant = 'default',
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const colors = variantColors[variant];
  const backgroundColor = disabled ? '#ccc' : colors.background;
  const textColor = disabled ? '#666' : colors.text;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor, transform: [{ scale: scaleAnim }], opacity: disabled ? 0.7 : 1 },
          style,
        ]}
      >
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 4,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
});
