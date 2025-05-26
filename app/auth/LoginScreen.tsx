import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import styles from '../../styles/login.styles';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/apiService';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const testApi = async () => {
    try {
      console.log('Test de l\'API en cours...');
      const result = await authService.testConnection();
      Alert.alert('Test réussi', JSON.stringify(result, null, 2));
      console.log('Test API réussi:', result);
    } catch (error) {
      Alert.alert('Test échoué', error.message);
      console.error('Test API échoué:', error);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Tentative de connexion avec:', username);
      const result = await login(username.trim(), password);
      
      if (result.success) {
        Alert.alert('Succès', `Bienvenue ${result.user.firstname} !`);
        
        // Redirection selon le rôle (basé sur tes entités)
        const userRole = result.user.role;
        console.log('Rôle utilisateur:', userRole);
        
        switch (userRole) {
          case 'ADMIN':
            router.replace('/AccueilApprenantScreen');
            break;
          case 'FORMATEUR':
            router.replace('/AccueilApprenantScreen');
            break;
          case 'APPRENANT':
            router.replace('/AccueilApprenantScreen');
            break;
          default:
            router.replace('/AccueilApprenantScreen');
        }
      } else {
        Alert.alert('Erreur de connexion', result.message);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/gefor.jpg')}
        style={styles.logo}
      />

      <Text style={styles.label}>USERNAME</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrer votre username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!isLoading}
      />

      <Text style={styles.label}>MOT DE PASSE</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrer votre mot de passe"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setRememberMe(!rememberMe)}
        disabled={isLoading}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
          {rememberMe && <Text style={styles.checkboxCheckmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>Se souvenir de moi ?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={testApi} 
        style={[styles.button, { backgroundColor: 'orange', marginBottom: 10 }]}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Tester API</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleLogin}
        style={[styles.button, isLoading && styles.buttonDisabled]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Connexion</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity disabled={isLoading}>
        <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    </View>
  );
}
