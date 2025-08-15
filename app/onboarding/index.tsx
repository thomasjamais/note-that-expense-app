import Button from '@/components/ui/Button';
import { setHasSeenOnboarding } from '@/lib/onboarding';
import { theme } from '@/theme';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { slides } from './content';

const { width } = Dimensions.get('window');
const ART_SIZE = width * 0.72;

export default function OnboardingScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const lottieRefs = useRef<Record<string, LottieView | null>>({});
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (ev: any) => {
    const i = Math.round(ev.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const goToNextSlide = () => {
    if (index < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
    } else {
      setHasSeenOnboarding();
      router.replace('/auth');
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingBottom: theme.spacing.xxl,
      }}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
      >
        {slides.map((s) => (
          <View
            key={s.key}
            style={{
              width,
              padding: 24,
              justifyContent: 'center',
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              {s.artType === 'lottie' ? (
                <SafeLottieLazy
                  visible={index === i}
                  size={ART_SIZE}
                  getSource={s.getSource}
                  onFail={() => {
                    /* Optionnel: analytics, flag, etc. */
                  }}
                />
              ) : s.artType === 'svg' && s.artComponent ? (
                <s.artComponent width={ART_SIZE} height={ART_SIZE} />
              ) : (
                // fallback image si tu en as
                <Image
                  source={require('../../assets/images/new-icon.png')}
                  style={{ width: ART_SIZE, height: ART_SIZE, resizeMode: 'contain' }}
                />
              )}
            </View>

            <Text style={{ ...theme.typography.title, textAlign: 'center', marginBottom: 8 }}>
              {s.title}
            </Text>
            <Text
              style={{
                ...theme.typography.body,
                color: theme.colors.text.secondary,
                textAlign: 'center',
                marginHorizontal: 16,
              }}
            >
              {s.subtitle}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
        {slides.map((_, i) => (
          <View
            key={`dot-${i}`}
            style={{
              width: i === index ? 22 : 8,
              height: 8,
              borderRadius: 4,
              marginHorizontal: 4,
              backgroundColor: i === index ? theme.colors.primary[600] : theme.colors.neutral[300],
            }}
          />
        ))}
      </View>

      <View style={{ padding: 16 }}>
        <Button
          label={index < slides.length - 1 ? 'Continuer' : 'Commencer'}
          onPress={goToNextSlide}
        />
      </View>
    </SafeAreaView>
  );
}
