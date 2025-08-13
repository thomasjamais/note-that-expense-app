import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 16;

export default function BottomBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const routes = state.routes;

  const x = useRef(new Animated.Value(state.index)).current;
  useEffect(() => {
    Animated.spring(x, {
      toValue: state.index,
      useNativeDriver: true,
      bounciness: 12,
      speed: 16,
    }).start();
  }, [state.index]);

  const focusProgressFor = (i: number) =>
    x.interpolate({
      inputRange: [i - 1, i, i + 1],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: Math.max(insets.bottom, 12),
        paddingTop: 8,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: SCREEN_WIDTH - H_PADDING * 2,
          flexDirection: 'row',
          backgroundColor: theme.colors.surface,
          borderRadius: 24,
          paddingHorizontal: 10,
          paddingVertical: 8,
          gap: 6,
          ...theme.shadow.level2,
          borderWidth: 1,
          borderColor: theme.colors.primary[100],
        }}
      >
        {routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? (options.tabBarLabel as string)
              : (options.title ?? route.name);

          const isFocused = state.index === index;
          const progress = focusProgressFor(index);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

          const Icon =
            (options.tabBarIcon as
              | ((p: { color: string; size: number; focused: boolean }) => React.ReactNode)
              | undefined) ?? null;

          const iconColor = isFocused ? theme.colors.primary[700] : theme.colors.neutral[500];
          const labelColor = isFocused ? theme.colors.primary[700] : theme.colors.neutral[500];

          const bubbleScale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });
          const bubbleOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
          const iconTranslateY = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -1.5],
          });
          const labelOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] });

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              android_ripple={{ color: theme.colors.primary[100], borderless: false, radius: 24 }}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 21,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
              }}
            >
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 80,
                  height: 40,
                  borderRadius: 17,
                  backgroundColor: theme.colors.primary[50],
                  transform: [{ scale: bubbleScale }],
                  opacity: bubbleOpacity,
                }}
              />

              <View style={{ alignItems: 'center', gap: 2 }}>
                <Animated.View style={{ transform: [{ translateY: iconTranslateY }] }}>
                  {Icon ? (
                    Icon({ color: iconColor, size: 18, focused: isFocused })
                  ) : (
                    <FontAwesome name={fallbackIcon(route.name)} size={18} color={iconColor} />
                  )}
                </Animated.View>

                <Animated.Text
                  style={{
                    fontFamily: theme.typography.family.medium,
                    fontSize: 10,
                    color: labelColor,
                    opacity: labelOpacity,
                  }}
                  numberOfLines={1}
                >
                  {label}
                </Animated.Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function fallbackIcon(name: string): React.ComponentProps<typeof FontAwesome>['name'] {
  if (/chart|graph|Stats|Graphiques/i.test(name)) return 'bar-chart';
  if (/expense|dépenses|depenses/i.test(name)) return 'money';
  if (/settings|param/i.test(name)) return 'cog';
  return 'circle';
}
