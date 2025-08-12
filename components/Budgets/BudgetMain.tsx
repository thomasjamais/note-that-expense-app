import BudgetProgressCircle from '@/components/Budgets/BudgetProgress';
import StatCard from '@/components/DailyStats/StatCard';
import Skeleton from '@/components/Skeleton';
import { BudgetUsage } from '@/hooks/budgets/useGetCurrentBudgetUsageByTripId';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { theme } from '@/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Text, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function BudgetMain({
  budgetUsage,
  isBudgetUsageLoading,
  isBudgetUsageError,
}: {
  budgetUsage?: BudgetUsage;
  isBudgetUsageLoading: boolean;
  isBudgetUsageError: boolean;
}) {
  const { t } = useTranslation();
  const { data: activeTrip } = useGetActiveTrip();

  return (
    <View style={{ marginTop: theme.spacing.xl }}>
      {isBudgetUsageError && (
        <Text style={{ color: theme.colors.danger[600], textAlign: 'center' }}>
          {t('budgets.errorOne')}
        </Text>
      )}
      {isBudgetUsageLoading && (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Skeleton width={screenWidth * 0.55} height={200} borderRadius={110} />
          <Skeleton width={120} height={20} style={{ marginTop: 10 }} />
          <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
        </View>
      )}
      {!!budgetUsage && (
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              marginBottom: theme.spacing.md,
              textAlign: 'center',
            }}
          >
            {budgetUsage.scope === 'total'
              ? t('budgets.totalBudget')
              : t('budgets.monthlyBudget', {
                  month: new Date().toLocaleString('default', { month: 'long' }),
                })}
          </Text>
          <BudgetProgressCircle
            name={budgetUsage.name}
            spent={Number(budgetUsage.spentConverted)}
            amount={Number(budgetUsage.budgetAmount)}
            currencySymbol={activeTrip?.homeCurrencySymbol}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: theme.spacing.md,
            }}
          >
            <StatCard
              icon="money"
              label={t('budgets.plannedBudget')}
              value={`${budgetUsage.budgetAmount} ${activeTrip?.homeCurrencySymbol}`}
            />
            {Number(budgetUsage.spentConverted) > Number(budgetUsage.budgetAmount) ? (
              <StatCard
                icon="exclamation-circle"
                label={t('budgets.overpassed')}
                value={`${Number(budgetUsage.spentConverted) - Number(budgetUsage.budgetAmount) || 0} ${activeTrip?.homeCurrencySymbol}`}
                color={theme.colors.danger[600]}
              />
            ) : (
              <StatCard
                icon="check-circle"
                label={t('budgets.expenses')}
                value={`${budgetUsage.spentConverted} ${activeTrip?.homeCurrencySymbol}`}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}
