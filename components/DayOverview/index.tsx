import DailyStats from '@/components/DailyStats';
import Pie from '@/components/Pie';
import LineV2 from '@/components/LineV2';
import CategorySelector from '@/components/ui/CategorySelector';
import { useGetCategoriesForSelector } from '@/hooks/useGetCategoriesForSelector';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { theme } from '@/theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text } from 'react-native';
import IconButton from '@/components/ui/IconButton';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function DayOverview() {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();
  const { data: categories = [] } = useGetCategoriesForSelector();
  const [currentDay, setCurrentDay] = useState(new Date());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategorySelectionChange = (selectedIds: string[]) => {
    setSelectedCategories(selectedIds);
  };

  const goToPreviousDay = () => {
    setCurrentDay((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const goToNextDay = () => {
    setCurrentDay((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const canGoToNextDay = () => {
    const now = new Date();
    const nextDay = new Date(currentDay);
    nextDay.setDate(currentDay.getDate() + 1);
    return nextDay <= now;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Calcul des dates pour inclure toute la journée
  const startOfDay = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth(),
    currentDay.getDate(),
  );
  const endOfDay = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth(),
    currentDay.getDate() + 1,
  );

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Sélecteur de catégories flottant - en dehors du ScrollView */}
      <CategorySelector
        categories={categories}
        selectedCategories={selectedCategories}
        onSelectionChange={handleCategorySelectionChange}
        position="top-right"
      />

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.xl,
            paddingHorizontal: theme.spacing.md,
          }}
        >
          <IconButton onPress={goToPreviousDay}>
            <FontAwesome name="chevron-left" size={20} color={theme.colors.text.primary} />
          </IconButton>

          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                ...theme.typography.title,
                color: theme.colors.text.primary,
                textTransform: 'capitalize',
              }}
            >
              {formatDay(currentDay)}
            </Text>
            {isToday(currentDay) && (
              <Text
                style={{
                  ...theme.typography.small,
                  color: theme.colors.success[600],
                  marginTop: theme.spacing.xs,
                }}
              >
                {t('dayOverview.today')}
              </Text>
            )}
          </View>

          <IconButton onPress={goToNextDay} disabled={!canGoToNextDay()}>
            <FontAwesome
              name="chevron-right"
              size={20}
              color={canGoToNextDay() ? theme.colors.text.primary : theme.colors.text.secondary}
            />
          </IconButton>
        </View>

        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text
            style={{
              ...theme.typography.title,
              marginBottom: theme.spacing.lg,
              color: theme.colors.text.primary,
            }}
          >
            {t('dayOverview.statsTitle')}
          </Text>
          <DailyStats customDate={currentDay} />
        </View>

        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text
            style={{
              ...theme.typography.title,
              marginBottom: theme.spacing.lg,
              color: theme.colors.text.primary,
            }}
          >
            {t('dayOverview.categoriesTitle')}
          </Text>
          <Pie
            range="custom"
            customStart={startOfDay.toISOString()}
            customEnd={endOfDay.toISOString()}
            selectedCategories={selectedCategories}
            toggleCategory={() => {}} // Géré par le CategorySelector
            setSelectedCategories={setSelectedCategories}
          />
        </View>

        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text
            style={{
              ...theme.typography.title,
              marginBottom: theme.spacing.lg,
              color: theme.colors.text.primary,
            }}
          >
            {t('dayOverview.evolutionTitle')}
          </Text>
          <LineV2
            range="custom"
            customStart={startOfDay.toISOString()}
            customEnd={endOfDay.toISOString()}
            selectedCategories={selectedCategories}
            toggleCategory={() => {}} // Géré par le CategorySelector
            setSelectedCategories={setSelectedCategories}
          />
        </View>
      </ScrollView>
    </View>
  );
}
