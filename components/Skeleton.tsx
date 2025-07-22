import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

type SkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
};

export default function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 6,
  style,
}: SkeletonProps) {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(shimmerValue, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ]),
    ).start();
  }, [shimmerValue]);

  const backgroundColor = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#f5f5f5'],
  });

  return (
    <Animated.View
      style={[styles.skeleton, { width, height, borderRadius, backgroundColor }, style]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    marginVertical: 4,
  },
});
