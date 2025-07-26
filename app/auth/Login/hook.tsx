import api from '@/api';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';

interface LoginInput {
  email: string;
  password: string;
}

const loginUser = async (data: LoginInput) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      login(data.token);
    },
  });
};
