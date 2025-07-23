import { TIME } from '@/constants/Time';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

type Expenses = {
  id: string;
  userId: string;
  categoryId: string;
  categoryLabel: string;
  categoryColor: string;
  tripId: string;
  label: string;
  originalAmount: number;
  convertedAmount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const useGetExpensesByTripId = (tripId: string) => {
  return useQuery<Expenses[]>({
    queryKey: ['expenses', 'trip', tripId],
    queryFn: async () => {
      const { data } = await api.get(`/expenses/trip/${tripId}`);
      return data;
    },
    enabled: !!tripId,
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
  });
};
