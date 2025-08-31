import StatCard from '@/components/DailyStats/StatCard';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { theme } from '@/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useGetMonthStats } from '@/hooks/stats/useGetMonthStats';

type MonthStatsProps = {
  currentMonth: Date;
};

export default function MonthStats({ currentMonth }: MonthStatsProps) {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();
  const { data: monthStats, isLoading, isError } = useGetMonthStats(activeTrip?.id, currentMonth);

  if (isError) {
    return (
      <View style={{ alignItems: 'center', padding: theme.spacing.lg }}>
        <Text style={{ color: theme.colors.text.secondary }}>{t('monthStats.error')}</Text>
      </View>
    );
  }

  if (isLoading || !monthStats) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <StatCard icon="list" label={t('monthStats.days')} value="..." />
        <StatCard icon="money" label={t('monthStats.total')} value="..." variant="gradient" />
      </View>
    );
  }

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.sm,
        }}
      >
        <StatCard
          icon="calendar"
          label={t('monthStats.days')}
          value={`${monthStats.dayCount || 0}/${daysInMonth}`}
        />
        <StatCard
          icon="money"
          label={t('monthStats.total')}
          value={`${monthStats.totalSpentConverted || 0} ${activeTrip?.homeCurrencySymbol}`}
          variant="gradient"
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <StatCard
          icon="bar-chart"
          label={t('monthStats.averageDaily')}
          value={`${Number(monthStats?.avgDailySpentConverted || 0).toFixed(2)} ${activeTrip?.homeCurrencySymbol}`}
        />
        <StatCard
          icon="star"
          label={t('monthStats.biggestDay')}
          value={`${monthStats?.maxDailySpentConverted || 0} ${activeTrip?.homeCurrencySymbol}`}
        />
      </View>
    </View>
  );
}

