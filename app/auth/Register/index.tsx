import Button from '@/components/Button';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRegister } from './hook';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { mutate, isPending, isError, error } = useRegister();

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    mutate(
      { email, password, confirmPassword },
      {
        onSuccess: () => {
          Alert.alert('Succès', 'Inscription réussie');
        },
        onError: () => {
          Alert.alert('Erreur', 'Inscription échouée');
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

      <Text style={styles.label}>Confirmer le mot de passe</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button title={isPending ? 'Enregistrement...' : 'S’inscrire'} onPress={handleRegister} />
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
