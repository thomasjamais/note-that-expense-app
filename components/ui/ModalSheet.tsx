import { theme } from '@/theme';
import React, { useRef } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  View,
  ViewStyle,
} from 'react-native';

export function ModalSheet({
  visible,
  children,
  onClose,
  contentStyle,
}: {
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
  contentStyle?: ViewStyle;
}) {
  const translateY = useRef(new Animated.Value(0)).current;

  const open = () => {
    translateY.setValue(300);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const close = () => {
    Animated.timing(translateY, {
      toValue: 400,
      duration: 180,
      useNativeDriver: true,
    }).start(onClose);
  };

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        const shouldClose = g.dy > 120 || g.vy > 1.2;
        if (shouldClose) close();
        else
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
      },
    }),
  ).current;

  const backdropOpacity = translateY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  return (
    <Modal visible={visible} animationType="none" transparent onShow={open} onRequestClose={close}>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: backdropOpacity,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={close} />

        <Animated.View
          style={[
            {
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: theme.radii.xl,
              borderTopRightRadius: theme.radii.xl,
              paddingTop: theme.spacing.md,
              maxHeight: '86%',
              transform: [{ translateY }],
            },
            contentStyle,
          ]}
          {...pan.panHandlers}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 48,
              height: 5,
              borderRadius: 999,
              backgroundColor: theme.colors.neutral[200],
              marginBottom: theme.spacing.md,
            }}
          />

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.xl,
              paddingBottom: theme.spacing.xl,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            {children}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
