import api from '@/api';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

interface LoginInput {
  email: string;
  password: string;
}

const loginUser = async (data: LoginInput) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const useLogin = () => {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      login(data.token);
      router.replace('/main');
    },
  });
};
