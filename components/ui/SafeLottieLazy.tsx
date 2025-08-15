import LottieView, { AnimationObject } from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

type LottieSource = AnimationObject | { uri: string } | null;

export default function SafeLottieLazy({
  visible,
  size,
  getSource,
  onFail,
  style,
}: {
  visible: boolean;
  size: number;
  getSource: () => Promise<LottieSource> | LottieSource;
  onFail?: () => void;
  style?: any;
}) {
  const [src, setSrc] = useState<LottieSource | undefined>(undefined);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (visible && src === undefined && !failed) {
      (async () => {
        try {
          const r = await getSource();
          if (mounted) setSrc(r ?? null);
        } catch {
          if (mounted) {
            setFailed(true);
            onFail?.();
          }
        }
      })();
    }
    return () => {
      mounted = false;
    };
  }, [visible, src, failed, getSource, onFail]);

  if (!visible || failed || !src) return null;

  return (
    <View style={[{ width: size, height: size }, style]}>
      <LottieView
        source={src as any}
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
