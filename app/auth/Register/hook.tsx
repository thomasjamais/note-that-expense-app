import api from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
}

const registerUser = async (data: RegisterInput) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
