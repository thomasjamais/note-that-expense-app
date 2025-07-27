import api from '@/api';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

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
  const router = useRouter();

  const { showMessage } = useSnackbar();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      showMessage('Inscription réussie, vous pouvez vous connecter maintenant.', 'success');
      router.push('/auth/Login');
    },
    onError: (error) => {
      showMessage(`Erreur lors de l'inscription : ${error.message}`, 'error');
    },
  });
};
