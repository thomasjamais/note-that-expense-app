import { TripWithCurrencies } from '@/hooks/useGetActiveTrip';
import { Category } from '@/hooks/useGetCategories';
import { useGetExpensesByTripId } from '@/hooks/useGetExpensesByTripId';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HandleExpenseModal from './HandleExpenseModal';

type ExpenseListProps = {
  activeTrip: TripWithCurrencies;
  categories: Category[];
};

export default function ExpenseList({ activeTrip, categories }: ExpenseListProps) {
  const { t } = useTranslation();

  const { data: expensesForTrip } = useGetExpensesByTripId(activeTrip?.id || '');
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleExpensePress = (expense: any) => {
    setSelectedExpense(expense);
    setModalVisible(true);
  };

  return (
    <View>
      <Text style={[styles.title, { marginTop: 24 }]}>{t('expenses.addedExpenses')}</Text>

      {expensesForTrip?.length === 0 && <Text>{t('expenses.noExpenses')}</Text>}

      {expensesForTrip?.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={{
            padding: 12,
            backgroundColor: item.categoryColor,
            marginVertical: 6,
            borderRadius: 6,
          }}
          onPress={() => handleExpensePress(item)}
        >
          <Text>
            {new Date(item.date).toLocaleDateString()} - {item.label} ({item.categoryLabel})
          </Text>
          <Text>
            {item.originalAmount} {activeTrip?.localCurrencySymbol} / {item.convertedAmount}{' '}
            {activeTrip?.homeCurrencySymbol}
          </Text>
        </TouchableOpacity>
      ))}
      {selectedExpense && selectedExpense.categoryId && (
        <HandleExpenseModal
          activeTrip={activeTrip}
          categories={categories}
          selectedExpense={selectedExpense}
          modalVisible={modalVisible}
          setModalInvisible={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    marginTop: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginVertical: 8,
  },
});
