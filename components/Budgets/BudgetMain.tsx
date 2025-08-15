import BudgetProgressCircle from '@/components/Budgets/BudgetProgress';
import StatCard from '@/components/DailyStats/StatCard';
import Skeleton from '@/components/Skeleton';
import { BudgetUsage } from '@/hooks/budgets/useGetCurrentBudgetUsageByTripId';
import { useGetActiveTrip } from '@/hooks/useGetActiveTrip';
import { theme } from '@/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Text, View } from 'react-native';
import EmptyState from '../ui/EmptyState';
import FancyCard from '../ui/FancyCard';

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
  const router = useRouter();

  return (
    <View style={{ marginTop: theme.spacing.xxl }}>
      {isBudgetUsageError && (
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
              ...theme.typography.subtitle,
              marginBottom: theme.spacing.lg,
              textAlign: 'center',
            }}
          >
            {budgetUsage.scope === 'total'
              ? t('budgets.totalBudget')
              : t('budgets.monthlyBudget', {
                  month: new Date().toLocaleString('default', { month: 'long' }),
                })}
          </Text>
          <FancyCard variant="glass" title={budgetUsage.name} style={{ marginTop: 12 }}>
            <BudgetProgressCircle
              spent={Number(budgetUsage?.spentConverted)}
              amount={Number(budgetUsage?.budgetAmount)}
              currencySymbol={activeTrip?.homeCurrencySymbol}
            />

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <StatCard
                icon="money"
                label={t('budgets.plannedBudget')}
                value={`${budgetUsage?.budgetAmount} ${activeTrip?.homeCurrencySymbol}`}
                variant="outline"
              />
              {Number(budgetUsage?.spentConverted) > Number(budgetUsage?.budgetAmount) ? (
                <StatCard
                  icon="exclamation-circle"
                  label={t('budgets.overpassed')}
                  value={`${(Number(budgetUsage?.spentConverted) - Number(budgetUsage?.budgetAmount)).toFixed(0)} ${activeTrip?.homeCurrencySymbol}`}
                  color={theme.colors.danger[600]}
                  variant="gradient"
                />
              ) : (
                <StatCard
                  icon="check-circle"
                  label={t('budgets.expenses')}
                  value={`${budgetUsage?.spentConverted} ${activeTrip?.homeCurrencySymbol}`}
                  color={theme.colors.success[700]}
                  variant="elevated"
                />
              )}
            </View>
          </FancyCard>
        </View>
      )}
    </View>
  );
}
