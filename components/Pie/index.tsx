import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { PeriodRange, useGetPieChartForTripId } from '@/hooks/useGetPieChartForTripId';
import { getNumberOfDaysInRange } from '@/utils/dates';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Text, View } from 'react-native';
import Skeleton from '../Skeleton';
import Categories from './Categories';
import CategoryList from './CategoryList';
import Chart from './Chart';

const screenWidth = Dimensions.get('window').width;

type PieProps = {
  range: PeriodRange;
  customStart?: string;
  customEnd?: string;
  selectedCategories: string[];
  toggleCategory: (name: string) => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function Pie({
  range,
  customStart,
  customEnd,
  selectedCategories,
  toggleCategory,
  setSelectedCategories,
}: PieProps) {
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

  if (isError) {
    return (
      <View>
        <Text style={{ textAlign: 'center', color: 'red' }}>{t('pie.error')}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
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

          <Text>
            {t('pie.totalOnPeriod', {
              total: filteredData.reduce((total, item) => item.population + total, 0).toFixed(2),
            })}{' '}
            {activeTrip?.homeCurrencySymbol}
          </Text>
          <Text style={{ marginBottom: 10 }}>
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
