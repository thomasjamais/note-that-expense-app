import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

function computeOffline(s: NetInfoState | null) {
  if (!s) return false;
  if (s.isConnected === false) return true;
  if (s.isInternetReachable === false) return true;
  return false;
}

export default function OfflineBanner() {
  const [state, setState] = useState<NetInfoState | null>(null);
  const [offline, setOffline] = useState(false);
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // initial fetch
    NetInfo.fetch().then((s) => {
      setState(s);
      setOffline(computeOffline(s));
    });
    // subscribe
    const unsub = NetInfo.addEventListener((s) => {
      setState(s);
      setOffline(computeOffline(s));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    Animated.timing(slide, {
      toValue: offline ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [offline]);

  if (!offline) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) },
          ],
        },
      ]}
    >
      <Text style={styles.text}>
        Hors connexion — vos actions seront synchronisées au retour du réseau
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    backgroundColor: '#222',
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 9999,
  },
  text: { color: '#fff', textAlign: 'center' },
});
