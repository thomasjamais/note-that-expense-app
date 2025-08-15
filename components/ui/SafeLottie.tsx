import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Platform, View } from 'react-native';

export default function SafeLottie({
  source,
  size,
  onFail,
}: {
  source: string;
  size: number;
  onFail?: () => void;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <View style={{ width: size, height: size }}>
      <LottieView
        source={source}
        autoPlay
        loop
        {...(Platform.OS === 'android'
          ? {
              renderMode: 'SOFTWARE' as const,
              enableMergePathsAndroidForKitKatAndAbove: true,
              hardwareAccelerationAndroid: false,
            }
          : {})}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
