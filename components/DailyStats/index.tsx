import BudgetProgressCircle from '@/components/Budgets/BudgetProgress';
import StatCard from '@/components/DailyStats/StatCard';
import { useGetCurrentBudgetUsageByTripId } from '@/hooks/budgets/useGetCurrentBudgetUsageByTripId';
import { useGetDailyStats } from '@/hooks/stats/useGetDailyStats';
import { useGetTripStats } from '@/hooks/stats/useGetTripStats';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { theme } from '@/theme';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Text, View } from 'react-native';
import EmptyState from '../ui/EmptyState';
import FancyCard from '../ui/FancyCard';
import Skeleton from '../ui/Skeleton';
import DailyStatsSkeleton from './DailyStatsSkeleton';

const screenWidth = Dimensions.get('window').width;

type DailyStatsProps = {
  customDate?: Date;
};

export default function DailyStats({ customDate }: DailyStatsProps) {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();
  const {
    data: dailyStats,
    isLoading,
    isError,
    isFetching,
  } = useGetDailyStats(activeTrip?.id, customDate);
  const { data: tripStats } = useGetTripStats(activeTrip?.id);
  const {
    data: budgetUsage,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
  } = useGetCurrentBudgetUsageByTripId(activeTrip?.id);

  if (!dailyStats || dailyStats.expenseCount === 0) {
    return (
      <EmptyState
        title={t('dailyStats.noData')}
        description={t('dailyStats.noDataDesc')}
        illustration="clipboard"
        primaryAction={{
          label: t('dailyStats.addExpense'),
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

  if (isLoading || isFetching) return <DailyStatsSkeleton />;

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
          marginBottom: theme.spacing.lg,
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
          variant="gradient"
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
          variant="elevated"
        />
        <StatCard
          icon="star"
          label={t('dailyStats.biggest')}
          value={`${dailyStats?.maxSpentConverted} ${activeTrip?.homeCurrencySymbol}`}
          variant="outline"
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <StatCard
          icon="tags"
          label={t('dailyStats.topCategory')}
          value={dailyStats?.topCategory || 'NC'}
        />
      </View>

      {isBudgetLoading ? (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Skeleton width={screenWidth * 0.55} height={200} borderRadius={110} />
          <Skeleton width={120} height={20} style={{ marginTop: 10 }} />
          <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
        </View>
      ) : (
        <View>
          {budgetUsage && Number(budgetUsage.budgetAmount) > 0 ? (
            <FancyCard
              variant="glass"
              title={t('dailyStats.budgetComparison')}
              style={{ marginTop: theme.spacing.md }}
            >
              <BudgetProgressCircle
                spent={Number(budgetSpentToday)}
                amount={Number(budgetAmount)}
                currencySymbol={activeTrip?.homeCurrencySymbol}
              />
            </FancyCard>
          ) : (
            <EmptyState
              title={t('budgets.noBudgetsTitle')}
              description={t('budgets.noBudgetsDesc')}
              illustration="clipboard"
              primaryAction={{
                label: t('budgets.addOrEdit.title'),
                leftIconName: 'plus',
                onPress: () => {
                  router.push({
                    pathname: '/main/Settings',
                    params: { focusTab: 1 },
                  });
                },
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}
