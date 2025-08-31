import MonthStats from '@/components/MonthStats';
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

export default function MonthOverview() {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();
  const { data: categories = [] } = useGetCategoriesForSelector();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategorySelectionChange = (selectedIds: string[]) => {
    setSelectedCategories(selectedIds);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const canGoToNextMonth = () => {
    const now = new Date();
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    return nextMonth <= now;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Calcul des dates pour inclure tout le mois
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

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
          <IconButton onPress={goToPreviousMonth}>
            <FontAwesome name="chevron-left" size={20} color={theme.colors.text.primary} />
          </IconButton>

          <Text
            style={{
              ...theme.typography.title,
              color: theme.colors.text.primary,
              textTransform: 'capitalize',
            }}
          >
            {formatMonth(currentMonth)}
          </Text>

          <IconButton onPress={goToNextMonth} disabled={!canGoToNextMonth()}>
            <FontAwesome
              name="chevron-right"
              size={20}
              color={canGoToNextMonth() ? theme.colors.text.primary : theme.colors.text.secondary}
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
            {t('monthOverview.statsTitle')}
          </Text>
          <MonthStats currentMonth={currentMonth} />
        </View>

        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text
            style={{
              ...theme.typography.title,
              marginBottom: theme.spacing.lg,
              color: theme.colors.text.primary,
            }}
          >
            {t('monthOverview.categoriesTitle')}
          </Text>
          <Pie
            range="custom"
            customStart={startOfMonth.toISOString()}
            customEnd={endOfMonth.toISOString()}
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
            {t('monthOverview.evolutionTitle')}
          </Text>
          <LineV2
            range="custom"
            customStart={startOfMonth.toISOString()}
            customEnd={endOfMonth.toISOString()}
            selectedCategories={selectedCategories}
            toggleCategory={() => {}} // Géré par le CategorySelector
            setSelectedCategories={setSelectedCategories}
          />
        </View>
      </ScrollView>
    </View>
  );
}
