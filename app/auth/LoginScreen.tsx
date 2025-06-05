import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import styles from '../../styles/login.styles';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }


    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setErrorMessage('');
        console.log('Connexion réussie. Utilisateur :', data.user);

        // ✅ Stockage du token et des infos utilisateur
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        router.replace('/Accueil');
      } else {
        setErrorMessage(data.message || "Identifiants incorrects");
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorMessage("Une erreur est survenue");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/gefor.jpg')}
        style={styles.logo}
      />

      <Text style={styles.label}>NOM D'UTILISATEUR</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrer votre nom d'utilisateur"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Text style={styles.label}>MOT DE PASSE</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrer votre mot de passe"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMessage !== '' && (
        <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
          {errorMessage}
        </Text>
      )}

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
          {rememberMe && <Text style={styles.checkboxCheckmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>Se souvenir de moi ?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/forgot-password')} style={{ marginTop: 20 }}>
        <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    </View>
  );
}