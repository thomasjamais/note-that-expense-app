import { TripWithCurrencies } from '@/hooks/useGetActiveTrip';
import { Category } from '@/hooks/useGetCategories';
import { ScrollView, StyleSheet } from 'react-native';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';

type ExpensesProps = {
  activeTrip: TripWithCurrencies;
  categories: Category[];
};

export default function Expenses({ activeTrip, categories }: ExpensesProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AddExpense activeTrip={activeTrip} categories={categories} />
      <ExpenseList activeTrip={activeTrip} categories={categories} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 32,
  },
});
