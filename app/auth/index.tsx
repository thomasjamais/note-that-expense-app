import Button from '@/components/ui/Button';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './Login';
import RegisterScreen from './Register';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <View style={styles.container}>
      <View style={styles.switchButtons}>
        <Button label="Connexion" onPress={() => setMode('login')} />
        <Button label="Inscription" onPress={() => setMode('register')} />
      </View>

      <View style={styles.formContainer}>
        {mode === 'login' ? <LoginScreen /> : <RegisterScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  switchButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
