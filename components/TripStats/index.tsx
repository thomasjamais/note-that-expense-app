import { useGetCurrentBudgetUsageByTripId } from '@/hooks/budgets/useGetCurrentBudgetUsageByTripId';
import { useGetTripStats } from '@/hooks/stats/useGetTripStats';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import BudgetMain from '../Budgets/BudgetMain';
import StatCard from '../DailyStats/StatCard';
import Skeleton from '../Skeleton';

const screenWidth = Dimensions.get('window').width;

type TripStatsProps = {};

export default function TripStats({}: TripStatsProps) {
  const { t } = useTranslation();

  const { data: activeTrip } = useGetActiveTrip();
  const {
    data: tripStats,
    isLoading: isTripStatsLoading,
    isError,
  } = useGetTripStats(activeTrip?.id);
  const {
    data: budgetUsage,
    isLoading: isBudgetUsageLoading,
    isError: isBudgetUsageError,
  } = useGetCurrentBudgetUsageByTripId(activeTrip?.id);

  if (isError) {
    return (
      <View>
        <Text>{t('tripStats.noData')}</Text>
      </View>
    );
  }

  if (isTripStatsLoading) {
    return (
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Skeleton width={screenWidth * 0.55} height={200} borderRadius={110} />
        <Skeleton width={120} height={20} style={{ marginTop: 10 }} />
        <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('tripStats.title', { trip: activeTrip?.label })}</Text>

      <View style={styles.row}>
        <StatCard icon="list" label={t('tripStats.days')} value={`${tripStats?.dayCount}`} />
        <StatCard
          icon="money"
          label={t('tripStats.total')}
          value={`${tripStats?.totalSpentConverted} ${activeTrip?.homeCurrencySymbol}`}
        />
      </View>

      <View style={styles.row}>
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

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
