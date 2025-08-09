import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import BudgetProgressCircle from '../Budgets/BudgetProgress';
import StatCard from '../DailyStats/StatCard';
import Skeleton from '../Skeleton';

const screenWidth = Dimensions.get('window').width;

type BudgetMainProps = {
  budgetUsage: any;
  isBudgetUsageLoading: boolean;
  isBudgetUsageError: boolean;
};

const getCurrentMonth = () => {
  const date = new Date();
  return date.toLocaleString('default', { month: 'long' });
};

export default function BudgetMain({
  budgetUsage,
  isBudgetUsageLoading,
  isBudgetUsageError,
}: BudgetMainProps) {
  const { data: activeTrip } = useGetActiveTrip();

  return (
    <View style={styles.container}>
      {isBudgetUsageError && (
        <Text style={{ color: 'red', textAlign: 'center' }}>
          Erreur lors du chargement du budget
        </Text>
      )}
      {isBudgetUsageLoading && (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Skeleton width={screenWidth * 0.55} height={200} borderRadius={110} />
          <Skeleton width={120} height={20} style={{ marginTop: 10 }} />
          <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
        </View>
      )}
      {budgetUsage && (
        <View>
          {budgetUsage.scope === 'total' ? (
            <Text style={styles.header}>Budget total pour ce voyage</Text>
          ) : (
            <Text style={styles.header}>Budget sur le mois en cours ({getCurrentMonth()})</Text>
          )}
          <BudgetProgressCircle
            name={budgetUsage?.name}
            spent={Number(budgetUsage?.spentConverted)}
            amount={Number(budgetUsage?.budgetAmount)}
            currencySymbol={activeTrip?.homeCurrencySymbol}
          />

          <View style={styles.row}>
            <StatCard
              icon="money"
              label="Budget prévu"
              value={`${budgetUsage?.budgetAmount} ${activeTrip?.homeCurrencySymbol}`}
            />
            {budgetUsage?.spentConverted > budgetUsage?.budgetAmount ? (
              <StatCard
                icon="exclamation-circle"
                label="Dépenses dépassées"
                value={`${budgetUsage?.spentConverted - budgetUsage?.budgetAmount} ${activeTrip?.homeCurrencySymbol}`}
                color="#FF0000"
              />
            ) : (
              <StatCard
                icon="check-circle"
                label="Dépenses dans le budget"
                value={`${budgetUsage?.spentConverted} ${activeTrip?.homeCurrencySymbol}`}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
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
