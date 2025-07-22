// index.tsx
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLogin } from './hook';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate, isPending, isError, error } = useLogin();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          Alert.alert('Succès', 'Connexion réussie');
        },
        onError: (error) => {
          Alert.alert('Erreur', 'Identifiants invalides');
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <Button title={isPending ? 'Connexion...' : 'Se connecter'} onPress={handleLogin} />
      {isError && <Text style={styles.error}>Erreur : {(error as Error)?.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginTop: 4,
    borderRadius: 6,
  },
  error: { color: 'red', marginTop: 10 },
});
