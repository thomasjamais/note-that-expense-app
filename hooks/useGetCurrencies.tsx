import api from '@/api';
import { TIME } from '@/constants/Time';
import { useQuery } from '@tanstack/react-query';

type Currency = {
  id: string;
  code: string;
  symbol: string;
  name: string;
};

export const useCurrencies = () => {
  return useQuery<Currency[]>({
    queryKey: ['currencies'],
    queryFn: async () => {
      const { data } = await api.get('/currencies');
      console.log('Fetched currencies:', data);
      return data;
    },
    staleTime: TIME.FIVE_MINUTES_IN_MILLISECONDS,
  });
};
