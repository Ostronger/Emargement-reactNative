import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../styles/login.styles';

export default function ForgotPasswordScreen() { 
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const regex = /@/;
    return regex.test(email);
  };

  const handleSubmit = () => { // Vérification de l'email
    if (!validateEmail(email)) { //
      setEmailError("Adresse email invalide");
      return;
    }

    setEmailError('');
    setMessage('Envoi en cours...');

    setTimeout(() => { // Simuler l'envoi du lien de réinitialisation
      setMessage(`Un lien de réinitialisation a été envoyé à ${email}`);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
        Mot de passe oublié
      </Text>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrer votre email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) setEmailError('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {emailError ? <Text style={{ color: 'red' }}>{emailError}</Text> : null} // Affichage de l'erreur si l'email est invalide

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Envoyer le lien</Text>
      </TouchableOpacity>

      {message !== '' && (
        <>
          <Text style={{ marginTop: 20, color: 'green', textAlign: 'center' }}>
            {message}
          </Text>

          <TouchableOpacity
            onPress={() => router.push({ pathname: '/auth/reset-password', params: { email } })} // Redirection vers la page de réinitialisation du mot de passe
            style={[styles.button, { marginTop: 10 }]}
        >
          <Text style={styles.buttonText}>Changer le mot de passe</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={styles.forgotText}>Retour à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
}