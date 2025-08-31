import BudgetMain from '@/components/Budgets/BudgetMain';
import StatCard from '@/components/DailyStats/StatCard';
import { useGetCurrentBudgetUsageByTripId } from '@/hooks/budgets/useGetCurrentBudgetUsageByTripId';
import { useGetTripStats } from '@/hooks/stats/useGetTripStats';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { theme } from '@/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import TripStatsSkeleton from './TripStatsSkeleton';
import EmptyState from '../ui/EmptyState';

export default function TripStats({ tripId }: { tripId: string }) {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();
  const { data: tripStats, isLoading, isError, isFetching } = useGetTripStats(tripId);
  const {
    data: budgetUsage,
    isLoading: isBudgetUsageLoading,
    isError: isBudgetUsageError,
  } = useGetCurrentBudgetUsageByTripId(tripId);

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

  if (isLoading || isFetching) {
    return <TripStatsSkeleton />;
  }

  return (
    <View style={{ paddingTop: theme.spacing.md }}>
      <Text
        style={{
          ...theme.typography.subtitle,
          marginBottom: theme.spacing.lg,
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
          variant="gradient"
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
