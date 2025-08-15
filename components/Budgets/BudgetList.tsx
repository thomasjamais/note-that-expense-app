import { useEditBudget } from '@/hooks/budgets/useEditBudget';
import { Budgets } from '@/hooks/budgets/useGetBudgetsByTripId';
import { theme } from '@/theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EditBudgetModal from './EditBudgetModal';
type BudgetListProps = {
  budgets: Budgets[];
};

export default function BudgetList({ budgets }: BudgetListProps) {
  const { t } = useTranslation();
  const { mutate: updateBudget } = useEditBudget();
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);

  if (!budgets.length) {
    return <Text style={{ ...theme.typography.subtitle }}>{t('budgets.noBudgetsTitle')}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('budgets.tripBudgets')}</Text>
      {budgets.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.budgetItem}
          onPress={() => setShowEditBudgetModal(true)}
        >
          <Text style={styles.budgetName}>
            {item.name} ({item.scope === 'total' ? t('budgets.total') : t('budgets.monthly')})
          </Text>
          <Text style={styles.amount}>{item.amount}</Text>
          {item.scope === 'monthly' && item.startDate && item.endDate && (
            <Text>
              Du {new Date(item.startDate).toLocaleDateString()} au{' '}
              {new Date(item.endDate).toLocaleDateString()}
            </Text>
          )}
          <EditBudgetModal
            visible={showEditBudgetModal}
            onClose={() => setShowEditBudgetModal(false)}
            onEdit={(data) => {
              updateBudget({
                tripId: item.tripId,
                ...data,
              });
            }}
            budget={item}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  budgetItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  budgetName: { fontWeight: '600', fontSize: 16 },
  amount: { fontSize: 14, marginTop: 4 },
  spent: { color: '#555', marginTop: 4 },
});
