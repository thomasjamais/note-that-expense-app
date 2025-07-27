import api from '@/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
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
  const { showMessage } = useSnackbar();

  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,

    onError: (error) => {
      showMessage(`Erreur lors de la connexion : ${error.message}`, 'error');
    },
    onSuccess: async (data) => {
      login(data.token);
      showMessage('Connexion réussie', 'success');
    },
  });
};
