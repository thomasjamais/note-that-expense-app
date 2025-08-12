import Button from '@/components/ui/Button';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
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

    mutate({ email, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <Button label={isPending ? 'Connexion...' : 'Se connecter'} onPress={handleLogin} />
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

// import React, { useState } from 'react';
// import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
// import { useLogin } from './hook';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { mutate, isLoading, isError } = useLogin();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Connexion</Text>
//       {isError && <Text style={styles.error}>Échec de la connexion</Text>}
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Mot de passe"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Button
//         title={isLoading ? '…' : 'Se connecter'}
//         onPress={() => mutate({ email, password })}
//         disabled={isLoading || !email || !password}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex:1, justifyContent:'center', padding:16, backgroundColor:'#fff' },
//   title: { fontSize:24, fontWeight:'bold', marginBottom:24, textAlign:'center' },
//   error: { color:'red', marginBottom:12, textAlign:'center' },
//   input: { borderWidth:1, borderColor:'#ccc', borderRadius:4, padding:8, marginBottom:12 },
// });
