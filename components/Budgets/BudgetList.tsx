import { useEditBudget } from '@/hooks/budgets/useEditBudget';
import { Budgets } from '@/hooks/budgets/useGetBudgetsByTripId';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EditBudgetModal from './EditBudgetModal';
type BudgetListProps = {
  budgets: Budgets[];
};

export default function BudgetList({ budgets }: BudgetListProps) {
  const { mutate: updateBudget } = useEditBudget();
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);

  if (!budgets.length) {
    return <Text>Aucun budget pour ce trip.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budgets du trip</Text>
      {budgets.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.budgetItem}
          onPress={() => setShowEditBudgetModal(true)}
        >
          <Text style={styles.budgetName}>
            {item.name} ({item.scope === 'total' ? 'Total' : 'Mensuel'})
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
          {/* {typeof item.spentConverted === 'number' && (
            <Text style={styles.spent}>
              Dépensé : {item.spentConverted} {item.currencySymbol}
            </Text>
          )} */}
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
