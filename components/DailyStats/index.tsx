import { useGetCurrentBudgetUsageByTripId } from '@/hooks/budgets/useGetCurrentBudgetUsageByTripId';
import { useGetDailyStats } from '@/hooks/stats/useGetDailyStats';
import { useGetTripStats } from '@/hooks/stats/useGetTripStats';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import BudgetProgressCircle from '../Budgets/BudgetProgress';
import Skeleton from '../Skeleton';
import StatCard from './StatCard';

const screenWidth = Dimensions.get('window').width;

type DailyStatsProps = {};

export default function DailyStats({}: DailyStatsProps) {
  const { data: activeTrip } = useGetActiveTrip();
  const {
    data: dailyStats,
    isLoading: isDailyStatsLoading,
    isError,
  } = useGetDailyStats(activeTrip?.id);
  const { data: tripStats } = useGetTripStats(activeTrip?.id);
  const { data: budgetUsage } = useGetCurrentBudgetUsageByTripId(activeTrip?.id);

  const budgetSpentToday = dailyStats?.totalSpentConverted ?? 0;
  const budgetAmount = Number(budgetUsage?.budgetAmount ?? 0) / (tripStats?.dayCount ?? 1);
  if (isError) {
    return (
      <View>
        <Text>Vous n'avez pas encore de dépenses aujourd'hui</Text>
      </View>
    );
  }

  if (isDailyStatsLoading) {
    return (
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Skeleton width={screenWidth * 0.55} height={200} borderRadius={110} />
        <Skeleton width={120} height={20} style={{ marginTop: 10 }} />
        <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
      </View>
    );
  }
  const date = new Date(dailyStats?.day ?? 0);
  const formattedDate = isNaN(date.getTime()) ? '' : date.toLocaleDateString();

  const dailyAvg = dailyStats?.avgSpentConverted ?? 0;
  const tripAvg = tripStats?.avgDailySpentConverted ?? 0;
  const diff = dailyAvg - tripAvg;
  const percent = ((diff / tripAvg) * 100).toFixed(1);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rapport du jour {formattedDate}</Text>
      <View style={styles.row}>
        <StatCard icon="list" label="Dépenses" value={`${dailyStats?.expenseCount}`} />
        <StatCard
          icon="money"
          label="Total"
          value={`${dailyStats?.totalSpentConverted} ${activeTrip?.homeCurrencySymbol}`}
          arrow={(diff ?? 0) > 0 ? 'up' : 'down'}
          tooltipTitle={
            (diff ?? 0) > 0
              ? `En augmentation de ${percent}% (${diff.toFixed(2)} ${activeTrip?.homeCurrencySymbol})`
              : `En diminution de ${Math.abs(Number(percent))}% (${Math.abs(diff).toFixed(2)} ${activeTrip?.homeCurrencySymbol})`
          }
        />
      </View>
      <View style={styles.row}>
        <StatCard
          icon="bar-chart"
          label="Moyenne"
          value={`${Number(dailyStats?.avgSpentConverted).toFixed(2)} ${activeTrip?.homeCurrencySymbol}`}
        />
        <StatCard
          icon="star"
          label="Plus grosse dépense"
          value={`${dailyStats?.maxSpentConverted} ${activeTrip?.homeCurrencySymbol}`}
        />
      </View>
      <View style={styles.row}>
        <StatCard icon="tags" label="Top catégorie" value={dailyStats!.topCategory} />
      </View>
      <BudgetProgressCircle
        name="Dépenses comparées au budget"
        spent={Number(budgetSpentToday)}
        amount={Number(budgetAmount)}
        currencySymbol={activeTrip?.homeCurrencySymbol}
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
