import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

SplashScreen.preventAutoHideAsync(); // garde le splash natif visible

export default function SplashScreenAnimated() {
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // Dès que l’anim est terminée, on cache le splash natif et on navigue
  const onAnimationFinish = useCallback(async () => {
    setIsAnimationDone(true);
    await SplashScreen.hideAsync();
    router.replace('/');
  }, [router]);

  // En cas de layout ready, si anim finie, on cache
  const onLayout = useCallback(async () => {
    if (isAnimationDone) {
      await SplashScreen.hideAsync();
    }
  }, [isAnimationDone]);

  return (
    <View style={[styles.container, { width, height }]} onLayout={onLayout}>
      <LottieView
        source={require('../assets/animations/splash.json')}
        autoPlay
        loop={false}
        onAnimationFinish={onAnimationFinish}
        style={{ width: width * 0.8, height: width * 0.8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
