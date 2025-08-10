import { BudgetUsage } from '@/hooks/budgets/useGetCurrentBudgetUsageByTripId';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import BudgetProgressCircle from '../Budgets/BudgetProgress';
import StatCard from '../DailyStats/StatCard';
import Skeleton from '../Skeleton';

const screenWidth = Dimensions.get('window').width;

type BudgetMainProps = {
  budgetUsage?: BudgetUsage;
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
  const { t } = useTranslation();

  const { data: activeTrip } = useGetActiveTrip();

  return (
    <View style={styles.container}>
      {isBudgetUsageError && (
        <Text style={{ color: 'red', textAlign: 'center' }}>{t('budgets.errorOne')}</Text>
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
            <Text style={styles.header}>{t('budgets.totalBudget')}</Text>
          ) : (
            <Text style={styles.header}>
              {t('budgets.monthlyBudget', { month: getCurrentMonth() })}
            </Text>
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
              label={t('budgets.plannedBudget')}
              value={`${budgetUsage?.budgetAmount} ${activeTrip?.homeCurrencySymbol}`}
            />
            {Number(budgetUsage?.spentConverted) > Number(budgetUsage?.budgetAmount) ? (
              <StatCard
                icon="exclamation-circle"
                label={t('budgets.overpassed')}
                value={`${Number(budgetUsage?.spentConverted) - Number(budgetUsage?.budgetAmount) || 0} ${activeTrip?.homeCurrencySymbol}`}
                color="#FF0000"
              />
            ) : (
              <StatCard
                icon="check-circle"
                label={t('budgets.expenses')}
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
