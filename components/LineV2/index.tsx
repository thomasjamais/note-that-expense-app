import Shimmer from '@/components/ui/Skeleton';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { LineChartData, useGetLineChartForTripId } from '@/hooks/useGetLineChartForTripId';
import { PeriodRange } from '@/hooks/useGetPieChartForTripId';
import { theme } from '@/theme';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import CategoryChips from './CategoryChips';
import EvolutionChart from './EvolutionChart';
import EmptyState from '../ui/EmptyState';
import { router } from 'expo-router';

type LineV2Props = {
  range: PeriodRange;
  customStart?: string;
  customEnd?: string;
  selectedCategories: string[];
  toggleCategory: (name: string) => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function LineV2({
  range,
  customStart,
  customEnd,
  selectedCategories,
  toggleCategory,
  setSelectedCategories,
}: LineV2Props) {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();

  const { data, isLoading, isError } = useGetLineChartForTripId(
    activeTrip?.id,
    range,
    customStart ? new Date(customStart) : undefined,
    customEnd ? new Date(customEnd) : undefined,
  );

  useEffect(() => {
    if (data && selectedCategories.length === 0) {
      setSelectedCategories(data.legend);
    }
  }, [data, selectedCategories.length, setSelectedCategories]);

  const filtered = useMemo<LineChartData | undefined>(() => {
    if (!data) return undefined;
    const idx = data.legend
      .map((name, i) => (selectedCategories.includes(name) ? i : -1))
      .filter((i) => i !== -1);
    return {
      labels: data.labels,
      legend: idx.map((i) => data.legend[i]),
      barColors: idx.map((i) => data.barColors[i]),
      data: data.data.map((row) => idx.map((i) => row[i])),
    };
  }, [data, selectedCategories]);

  if (isError) {
    return (
      <EmptyState
        title={t('chartErrors.errorTitle')}
        description={t('chartErrors.errorDescription')}
        illustration="chart"
        primaryAction={{
          label: t('chartErrors.retry'),
          onPress: () => window.location.reload(),
        }}
      />
    );
  }

  if (isLoading || !filtered) {
    return (
      <View style={{ paddingTop: theme.spacing.lg }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.spacing.md }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer
              key={i}
              width={110}
              height={34}
              borderRadius={999}
              style={{ marginRight: 8, marginBottom: 8 }}
            />
          ))}
        </View>
        <Shimmer height={28} width={260} borderRadius={8} style={{ marginTop: 12 }} />
        <Shimmer height={260} width="100%" borderRadius={16} style={{ marginTop: 12 }} />
      </View>
    );
  }

  if (!isLoading && (!data?.data || data.data.length === 0)) {
    return (
      <EmptyState
        title={t('chartErrors.noDataTitle')}
        description={t('chartErrors.noDataDescription')}
        illustration="clipboard"
        primaryAction={{
          label: t('chartErrors.addExpense'),
          leftIconName: 'plus',
          onPress: () => {
            router.push({
              pathname: '/main',
              params: { focusTab: 0 },
            });
          },
        }}
      />
    );
  }

  const totals = filtered.legend.map((_, i) =>
    filtered.data.reduce((sum, row) => sum + (row[i] || 0), 0),
  );

  return (
    <View style={{ paddingTop: theme.spacing.xs }}>
      <Text
        style={{
          marginTop: theme.spacing.md,
          marginBottom: theme.spacing.sm,
          textAlign: 'center',
          ...theme.typography.subtitle,
        }}
      >
        {t('line.title')}
      </Text>

      <CategoryChips
        data={filtered}
        selected={selectedCategories}
        onToggle={toggleCategory}
        allLegend={data?.legend ?? []}
      />

      <EvolutionChart data={filtered} currency={activeTrip?.homeCurrencySymbol} />

      <View style={{ marginTop: theme.spacing.sm, alignItems: 'center' }}>
        <Text
          style={{ color: theme.colors.text.secondary, fontFamily: theme.typography.family.medium }}
        >
          {t('budgets.total')} :{' '}
          <Text style={{ color: theme.colors.text.primary }}>
            {totals.reduce((a, b) => a + b, 0).toFixed(2)} {activeTrip?.homeCurrencySymbol}
          </Text>
        </Text>
      </View>
    </View>
  );
}
