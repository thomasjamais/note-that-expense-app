import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { PeriodRange, useGetPieChartForTripId } from '@/hooks/useGetPieChartForTripId';
import { theme } from '@/theme';
import { getNumberOfDaysInRange } from '@/utils/dates';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import Skeleton from '../ui/Skeleton';
import Categories from './Categories';
import CategoryList from './CategoryList';
import DonutChart from './DonutChart';

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

  const { data, isLoading, isError } = useGetPieChartForTripId(
    activeTrip?.id,
    range,
    customStart ? new Date(customStart) : undefined,
    customEnd ? new Date(customEnd) : undefined,
  );

  const numberOfDaysInRange = useMemo(
    () =>
      getNumberOfDaysInRange(
        range,
        new Date(activeTrip?.startDate!),
        customStart ? new Date(customStart) : undefined,
        customEnd ? new Date(customEnd) : undefined,
      ),
    [range, activeTrip?.startDate, customStart, customEnd],
  );

  useEffect(() => {
    if (data && selectedCategories.length === 0) {
      setSelectedCategories(data.map((c: any) => c.name));
    }
  }, [data, selectedCategories.length, setSelectedCategories]);

  const filtered = useMemo(
    () => data?.filter((c: any) => selectedCategories.includes(c.name)) ?? [],
    [data, selectedCategories],
  );

  const total = useMemo(
    () => filtered.reduce((sum, it) => sum + (it.population || 0), 0),
    [filtered],
  );

  const [activeSlice, setActiveSlice] = useState<string | null>(null);

  if (isError) {
    return (
      <Text style={{ color: theme.colors.danger[600], textAlign: 'center' }}>{t('pie.error')}</Text>
    );
  }

  if (isLoading || !data) {
    return (
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Skeleton width={screenWidth * 0.55} height={200} borderRadius={110} />
        <Skeleton width={180} height={18} style={{ marginTop: 10 }} />
        <Skeleton width={120} height={18} style={{ marginTop: 6 }} />
      </View>
    );
  }

  const centerInfo = (() => {
    const found = filtered.find((f) => f.name === activeSlice);
    if (!found) {
      return {
        title: t('pie.title'),
        value: `${total.toFixed(2)} ${activeTrip?.homeCurrencySymbol}`,
        note:
          numberOfDaysInRange > 0
            ? `${t(
                'tripStats.averageDaily',
              )} : ${(total / numberOfDaysInRange).toFixed(2)} ${activeTrip?.homeCurrencySymbol}`
            : '',
      };
    }
    const pct = total > 0 ? Math.round((found.population / total) * 100) : 0;
    return {
      title: found.name,
      value: `${found.population.toFixed(2)} ${activeTrip?.homeCurrencySymbol}`,
      note: `${pct}%`,
    };
  })();

  return (
    <ScrollView style={{ paddingTop: theme.spacing.md }}>
      <Text
        style={{
          ...theme.typography.subtitle,
          textAlign: 'center',
          marginBottom: theme.spacing.md,
        }}
      >
        {t('pie.title')}
      </Text>

      <Categories
        pieChartData={data}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        toggleCategory={toggleCategory}
      />

      {filtered.length === 0 ? (
        <Text style={{ textAlign: 'center', color: theme.colors.text.secondary }}>
          {t('pie.noCategory')}
        </Text>
      ) : (
        <DonutChart
          data={filtered}
          total={total}
          onSlicePress={setActiveSlice}
          activeName={activeSlice}
          centerTitle={centerInfo.title}
          centerValue={centerInfo.value}
          centerNote={centerInfo.note}
        />
      )}

      <CategoryList
        pieChartData={filtered}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
      />
    </ScrollView>
  );
}
