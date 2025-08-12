import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { useGetLineChartForTripId } from '@/hooks/useGetLineChartForTripId';
import { PeriodRange } from '@/hooks/useGetPieChartForTripId';
import { theme } from '@/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import CategoriesLine from './Categories';
import ChartLine from './Chart';

export default function Line({
  range,
  customStart,
  customEnd,
  selectedCategories,
  toggleCategory,
  setSelectedCategories,
}: {
  range: PeriodRange;
  customStart?: string;
  customEnd?: string;
  selectedCategories: string[];
  toggleCategory: (n: string) => void;
  setSelectedCategories: React.SetStateAction<any>;
}) {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();
  const { data: stackedBarData } = useGetLineChartForTripId(
    activeTrip?.id,
    range,
    customStart ? new Date(customStart) : undefined,
    customEnd ? new Date(customEnd) : undefined,
  );
  if (!stackedBarData) return null;
  return (
    <View style={{ marginTop: theme.spacing.lg }}>
      <Text
        style={{
          ...theme.typography.subtitle,
          textAlign: 'center',
          marginBottom: theme.spacing.sm,
        }}
      >
        {t('line.title')}
      </Text>
      <CategoriesLine
        stackedBarData={stackedBarData}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
      />
      <ChartLine
        stackedBarData={stackedBarData}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories as any}
      />
    </View>
  );
}
