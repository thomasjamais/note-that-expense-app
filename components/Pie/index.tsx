import Skeleton from '@/components/Skeleton';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { PeriodRange, useGetPieChartForTripId } from '@/hooks/useGetPieChartForTripId';
import { theme } from '@/theme';
import { getNumberOfDaysInRange } from '@/utils/dates';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Text, View } from 'react-native';
import Categories from './Categories';
import CategoryList from './CategoryList';
import Chart from './Chart';

const screenWidth = Dimensions.get('window').width;

export default function Pie({
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
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();
  const {
    data: pieChartData,
    isLoading,
    isError,
  } = useGetPieChartForTripId(
    activeTrip?.id,
    range,
    customStart ? new Date(customStart) : undefined,
    customEnd ? new Date(customEnd) : undefined,
  );

  const filteredData = pieChartData?.filter((c: any) => selectedCategories.includes(c.name));
  const numberOfDaysInRange = getNumberOfDaysInRange(
    range,
    new Date(activeTrip?.startDate!),
    customStart ? new Date(customStart) : undefined,
    customEnd ? new Date(customEnd) : undefined,
  );

  if (isError)
    return (
      <Text style={{ color: theme.colors.danger[600], textAlign: 'center' }}>{t('pie.error')}</Text>
    );

  return (
    <View>
      <Text
        style={{
          ...theme.typography.subtitle,
          textAlign: 'center',
          marginBottom: theme.spacing.sm,
        }}
      >
        {t('pie.title')}
      </Text>
      {isLoading || !filteredData?.length ? (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Skeleton width={screenWidth * 0.55} height={200} borderRadius={110} />
          <Skeleton width={120} height={20} style={{ marginTop: 10 }} />
          <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
        </View>
      ) : (
        <>
          <Categories
            pieChartData={pieChartData!}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            toggleCategory={toggleCategory}
          />
          <Text style={{ color: theme.colors.text.secondary }}>
            {t('pie.totalOnPeriod', {
              total: filteredData.reduce((total, item) => item.population + total, 0).toFixed(2),
            })}{' '}
            {activeTrip?.homeCurrencySymbol}
          </Text>
          <Text style={{ marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
            {t('pie.amountPerDay', {
              amount: (
                filteredData.reduce((total, item) => item.population + total, 0) /
                numberOfDaysInRange
              ).toFixed(2),
            })}{' '}
            {activeTrip?.homeCurrencySymbol}
          </Text>
          <Chart filteredData={filteredData!} />
          <CategoryList
            pieChartData={pieChartData!}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
          />
        </>
      )}
    </View>
  );
}
