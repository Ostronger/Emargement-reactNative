import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from '../../styles/login.styles';

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams(); // récupération du paramètre
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleReset = () => {
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.'); // Vérification de la longueur du mot de passe
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setError('');
    setMessage(`Mot de passe de ${email} mis à jour avec succès !`);
    console.log(`Nouveau mot de passe pour ${email} : ${password}`);

    setTimeout(() => { // Simuler une action après la réinitialisation
      router.push('/'); 
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Réinitialisation du mot de passe
      </Text>

      <Text style={styles.label}>NOUVEAU MOT DE PASSE</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrer un nouveau mot de passe"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>CONFIRMER LE MOT DE PASSE</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        placeholderTextColor="#ccc"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {error !== '' && (
        <Text style={{ color: 'red', marginVertical: 10, textAlign: 'center' }}>
          {error}
        </Text>
      )}

      {message !== '' && (
        <Text style={{ color: 'green', marginVertical: 10, textAlign: 'center' }}>
          {message}
        </Text>
      )}

      <TouchableOpacity onPress={handleReset} style={styles.button}>
        <Text style={styles.buttonText}>Valider</Text> // Bouton de validation
      </TouchableOpacity>
    </View>
  );
}