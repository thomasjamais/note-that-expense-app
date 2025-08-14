import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

type Props = {
  width: number | string;
  height: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  baseColor?: string;
  highlightColor?: string;
};

export default function Skeleton({
  width,
  height,
  borderRadius = 12,
  style,
  baseColor = '#EAECEE',
  highlightColor = '#F6F7F8',
}: Props) {
  const anim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  return (
    <Animated.View
      style={[
        {
          width: Number(width),
          height: Number(height),
          borderRadius,
          overflow: 'hidden',
          backgroundColor: baseColor,
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          transform: [{ translateX }],
          height: '100%',
          width: 200,
        }}
      >
        <LinearGradient
          colors={[baseColor, highlightColor, baseColor]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </Animated.View>
  );
}
