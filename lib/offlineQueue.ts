import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

const QUEUE_KEY = 'offline_expenses_queue';

export async function queueExpense(expense: any) {
  const stored = await AsyncStorage.getItem(QUEUE_KEY);
  const existing = stored ? JSON.parse(stored) : [];
  existing.push(expense);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(existing));
}

export async function flushExpenses() {
  const stored = await AsyncStorage.getItem(QUEUE_KEY);
  const items = stored ? JSON.parse(stored) : [];
  for (const exp of items) {
    try {
      const { tripId, ...expenseData } = exp;
      await api.post(`/expenses/trip/${tripId}`, expenseData);
    } catch {}
  }
  await AsyncStorage.removeItem(QUEUE_KEY);
}
