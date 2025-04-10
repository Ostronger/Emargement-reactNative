import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import styles from '../styles/login.styles';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/gefor.jpg')}
        style={styles.logo}
      />

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrer votre email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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

      {/* ✅ Checkbox custom */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
          {rememberMe && <Text style={styles.checkboxCheckmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>Se souvenir de moi ?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/Accueil')} style={styles.button}>
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    </View>
  );
}