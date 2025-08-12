import BudgetMain from '@/components/Budgets/BudgetMain';
import StatCard from '@/components/DailyStats/StatCard';
import Skeleton from '@/components/Skeleton';
import { useGetCurrentBudgetUsageByTripId } from '@/hooks/budgets/useGetCurrentBudgetUsageByTripId';
import { useGetTripStats } from '@/hooks/stats/useGetTripStats';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { theme } from '@/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export default function TripStats() {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();
  const { data: tripStats, isLoading, isError } = useGetTripStats(activeTrip?.id);
  const {
    data: budgetUsage,
    isLoading: isBudgetUsageLoading,
    isError: isBudgetUsageError,
  } = useGetCurrentBudgetUsageByTripId(activeTrip?.id);

  if (isError) {
    return <Text style={{ color: theme.colors.text.secondary }}>{t('tripStats.noData')}</Text>;
  }
  if (isLoading) {
    return (<Skeleton width={220} height={180} />) as any;
  }

  return (
    <View style={{ paddingTop: theme.spacing.md }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          marginBottom: theme.spacing.md,
          textAlign: 'center',
        }}
      >
        {t('tripStats.title', { trip: activeTrip?.label })}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.sm,
        }}
      >
        <StatCard icon="list" label={t('tripStats.days')} value={`${tripStats?.dayCount}`} />
        <StatCard
          icon="money"
          label={t('tripStats.total')}
          value={`${tripStats?.totalSpentConverted} ${activeTrip?.homeCurrencySymbol}`}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <StatCard
          icon="bar-chart"
          label={t('tripStats.averageDaily')}
          value={`${Number(tripStats?.avgDailySpentConverted).toFixed(2)} ${activeTrip?.homeCurrencySymbol}`}
        />
        <StatCard
          icon="star"
          label={t('tripStats.biggestExpense')}
          value={`${tripStats?.maxDailySpentConverted} ${activeTrip?.homeCurrencySymbol}`}
        />
      </View>
      <BudgetMain
        budgetUsage={budgetUsage}
        isBudgetUsageLoading={isBudgetUsageLoading}
        isBudgetUsageError={isBudgetUsageError}
      />
    </View>
  );
}
