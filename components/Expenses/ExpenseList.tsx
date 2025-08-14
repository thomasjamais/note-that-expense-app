import ExpenseListSkeleton from '@/components/Expenses/ExpenseListSkeleton';
import HandleExpenseModal from '@/components/Expenses/HandleExpenseModal';
import { Card } from '@/components/ui/Card';
import { TripWithCurrencies } from '@/hooks/useGetActiveTrip';
import { Category } from '@/hooks/useGetCategories';
import { useGetExpensesByTripId } from '@/hooks/useGetExpensesByTripId';
import { theme } from '@/theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ExpenseList({
  activeTrip,
  categories,
}: {
  activeTrip: TripWithCurrencies;
  categories: Category[];
}) {
  const { t } = useTranslation();
  const {
    data: expenses = [],
    isLoading,
    isFetching,
  } = useGetExpensesByTripId(activeTrip?.id || '');
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [visible, setVisible] = useState(false);

  if (isLoading || isFetching) {
    return <ExpenseListSkeleton rows={6} />;
  }

  return (
    <View>
      <Text
        style={{
          ...theme.typography.title,
          marginBottom: theme.spacing.sm,
        }}
      >
        {t('expenses.addedExpenses')}
      </Text>
      {!expenses.length && !isFetching && (
        <Text style={{ color: theme.colors.text.secondary }}>{t('expenses.noExpenses')}</Text>
      )}

      {!expenses.length && isFetching && <ExpenseListSkeleton rows={4} />}

      {expenses.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            setSelectedExpense(item);
            setVisible(true);
          }}
        >
          <Card style={{ marginBottom: theme.spacing.sm, paddingVertical: theme.spacing.md }}>
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 6,
                borderTopLeftRadius: theme.radii.md,
                borderBottomLeftRadius: theme.radii.md,
                backgroundColor: item.categoryColor,
              }}
            />
            <View style={{ paddingLeft: theme.spacing.sm }}>
              <Text style={{ fontWeight: '700', color: theme.colors.text.primary }}>
                {new Date(item.date).toLocaleDateString()} • {item.label}
              </Text>
              <Text style={{ color: theme.colors.text.secondary }}>{item.categoryLabel}</Text>
              <Text style={{ marginTop: 4 }}>
                {item.originalAmount} {activeTrip?.localCurrencySymbol} / {item.convertedAmount}{' '}
                {activeTrip?.homeCurrencySymbol}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}

      {selectedExpense && (
        <HandleExpenseModal
          activeTrip={activeTrip}
          categories={categories}
          selectedExpense={selectedExpense}
          modalVisible={visible}
          setModalInvisible={() => setVisible(false)}
        />
      )}
    </View>
  );
}
