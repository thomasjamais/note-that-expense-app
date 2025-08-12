import BudgetProgressCircle from '@/components/Budgets/BudgetProgress';
import StatCard from '@/components/DailyStats/StatCard';
import Skeleton from '@/components/Skeleton';
import { useGetCurrentBudgetUsageByTripId } from '@/hooks/budgets/useGetCurrentBudgetUsageByTripId';
import { useGetDailyStats } from '@/hooks/stats/useGetDailyStats';
import { useGetTripStats } from '@/hooks/stats/useGetTripStats';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { theme } from '@/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Text, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function DailyStats() {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();
  const { data: dailyStats, isLoading, isError } = useGetDailyStats(activeTrip?.id);
  const { data: tripStats } = useGetTripStats(activeTrip?.id);
  const { data: budgetUsage } = useGetCurrentBudgetUsageByTripId(activeTrip?.id);

  if (isError)
    return (
      <Text style={{ color: theme.colors.danger[600], textAlign: 'center' }}>
        {t('dailyStats.error')}
      </Text>
    );
  if (isLoading)
    return (
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Skeleton width={screenWidth * 0.55} height={200} borderRadius={110} />
        <Skeleton width={120} height={20} style={{ marginTop: 10 }} />
        <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
      </View>
    );

  const date = new Date(dailyStats?.day ?? 0);
  const formattedDate = isNaN(date.getTime()) ? '' : date.toLocaleDateString();

  const dailyAvg = dailyStats?.avgSpentConverted ?? 0;
  const tripAvg = tripStats?.avgDailySpentConverted ?? 0;
  const diff = dailyAvg - (tripAvg || 1);
  const percent = ((diff / (tripAvg || 1)) * 100).toFixed(1);

  const budgetSpentToday = dailyStats?.totalSpentConverted ?? 0;
  const budgetAmount = Number(budgetUsage?.budgetAmount ?? 0) / (tripStats?.dayCount || 1);

  return (
    <View style={{ marginTop: theme.spacing.md }}>
      <Text
        style={{
          ...theme.typography.subtitle,
          textAlign: 'center',
          marginBottom: theme.spacing.md,
        }}
      >
        {t('dailyStats.dailyDigest', { date: formattedDate })}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.sm,
        }}
      >
        <StatCard
          icon="list"
          label={t('dailyStats.expenses')}
          value={`${dailyStats?.expenseCount}`}
        />
        <StatCard
          icon="money"
          label={t('dailyStats.total')}
          value={`${dailyStats?.totalSpentConverted} ${activeTrip?.homeCurrencySymbol}`}
          arrow={(diff ?? 0) > 0 ? 'up' : 'down'}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.sm,
        }}
      >
        <StatCard
          icon="bar-chart"
          label={t('dailyStats.average')}
          value={`${Number(dailyStats?.avgSpentConverted).toFixed(2)} ${activeTrip?.homeCurrencySymbol}`}
        />
        <StatCard
          icon="star"
          label={t('dailyStats.biggest')}
          value={`${dailyStats?.maxSpentConverted} ${activeTrip?.homeCurrencySymbol}`}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <StatCard
          icon="tags"
          label={t('dailyStats.topCategory')}
          value={dailyStats?.topCategory || 'NC'}
        />
      </View>

      <BudgetProgressCircle
        name={t('dailyStats.budgetComparison')}
        spent={Number(budgetSpentToday)}
        amount={Number(budgetAmount)}
        currencySymbol={activeTrip?.homeCurrencySymbol}
      />
    </View>
  );
}
