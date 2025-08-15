import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type SnackbarType = 'info' | 'success' | 'error';
export type SnackbarOptions = {
  type?: SnackbarType;
  duration?: number; // ms
  actionLabel?: string;
  onAction?: () => void;
};

interface SnackbarContextProps {
  showMessage: (message: string, options?: SnackbarOptions | SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextProps>({ showMessage: () => {} });

type QueueItem = { id: number; message: string; options: Required<SnackbarOptions> };

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [current, setCurrent] = useState<QueueItem | null>(null);

  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(1)).current; // 1 -> 0

  const topPadding = (Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0) + 8;

  const colorsByType = useMemo(
    () => ({
      info: {
        bg: theme.colors.neutral[800],
        fg: theme.colors.text.inverted,
        accent: theme.colors.secondary[400],
        icon: 'info-circle' as const,
      },
      success: {
        bg: theme.colors.success[800],
        fg: theme.colors.text.inverted,
        accent: theme.colors.success[400],
        icon: 'check-circle' as const,
      },
      error: {
        bg: theme.colors.danger[800],
        fg: theme.colors.text.inverted,
        accent: theme.colors.danger[400],
        icon: 'exclamation-circle' as const,
      },
    }),
    [],
  );

  const showMessage = useCallback((message: string, options?: SnackbarOptions | SnackbarType) => {
    const normalized: Required<SnackbarOptions> =
      typeof options === 'string'
        ? { type: options, duration: 1400, actionLabel: '', onAction: () => {} }
        : {
            type: options?.type ?? 'info',
            duration: options?.duration ?? 1400,
            actionLabel: options?.actionLabel ?? '',
            onAction: options?.onAction ?? (() => {}),
          };
    setQueue((q) => [...q, { id: Date.now(), message, options: normalized }]);
  }, []);

  useEffect(() => {
    if (current || queue.length === 0) return;
    setCurrent(queue[0]);
    setQueue((q) => q.slice(1));
  }, [current, queue]);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: theme.timing.fast,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, { toValue: 0, duration: theme.timing.fast, useNativeDriver: true }),
    ]).start(() => {
      setCurrent(null);
    });
  }, [opacity, translateY]);

  useEffect(() => {
    if (!current) return;

    progress.setValue(1);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: theme.timing.normal,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: theme.timing.normal,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 0,
        duration: current.options.duration,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) hide();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const onActionPress = useCallback(() => {
    if (!current) return;
    try {
      current.options.onAction?.();
    } finally {
      hide();
    }
  }, [current, hide]);

  const palette = current ? colorsByType[current.options.type] : colorsByType.info;

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}

      {current && (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.container, { paddingTop: topPadding, opacity }]}
        >
          <Animated.View
            style={[
              styles.toast,
              {
                transform: [{ translateY }],
                backgroundColor: palette.bg,
                shadowColor: '#000',
              },
            ]}
          >
            <View style={styles.row}>
              <FontAwesome
                name={palette.icon}
                size={18}
                color={palette.fg}
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.message, { color: palette.fg }]} numberOfLines={3}>
                {current.message}
              </Text>

              {!!current.options.actionLabel && (
                <Pressable onPress={onActionPress} hitSlop={8} style={{ marginLeft: 12 }}>
                  <Text
                    style={{
                      fontFamily: theme.typography.family.bold,
                      color: palette.accent,
                      fontSize: 13,
                    }}
                  >
                    {current.options.actionLabel}
                  </Text>
                </Pressable>
              )}

              <Pressable onPress={hide} hitSlop={8} style={{ marginLeft: 10 }}>
                <FontAwesome name="close" size={16} color={palette.fg} />
              </Pressable>
            </View>

            <View style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: palette.accent,
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['100%', '0%'],
                    }),
                  },
                ]}
              />
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  toast: {
    maxWidth: 680,
    width: '92%',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    ...theme.shadow.level3,
    borderWidth: 1,
    borderColor: theme.colors.neutral[800],
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  message: { flex: 1, fontFamily: theme.typography.family.medium, fontSize: 14 },
  progressTrack: { height: 3, borderRadius: 3, overflow: 'hidden', marginTop: 8 },
  progressBar: { height: 3, borderRadius: 3 },
});
