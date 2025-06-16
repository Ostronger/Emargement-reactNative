import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfilApprenantScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${apiUrl}/api/apprenant/profil`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const data = await res.json();

        setUsername(data.username);
        setEmail(data.email);
        setNom(data.lastname);
        setPrenom(data.firstname);
        setLoading(false);
      } catch (error) {
        Alert.alert("Erreur", "Impossible de récupérer le profil.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSavePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/apprenant/profil/password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert("Succès", result.message);
        setIsEditingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        Alert.alert("Erreur", result.message || "Échec de la mise à jour.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Problème lors de la mise à jour du mot de passe.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/images/gefor.jpg')} style={styles.logo} />

      <Text style={styles.title}>Profil</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {prenom.charAt(0).toUpperCase() + nom.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>{prenom} {nom}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nom d'utilisateur</Text>
        <Text style={styles.info}>{username}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.info}>{email}</Text>

        <Text style={styles.label}>Mot de passe</Text>
        {isEditingPassword ? (
  <>
    <TextInput
      style={styles.input}
      placeholder="Mot de passe actuel"
      secureTextEntry
      value={currentPassword}
      onChangeText={setCurrentPassword}
    />
    <TextInput
      style={styles.input}
      placeholder="Nouveau mot de passe"
      secureTextEntry
      value={newPassword}
      onChangeText={setNewPassword}
    />
    <View style={styles.rowBetween}>
      <TouchableOpacity style={styles.saveBtn} onPress={handleSavePassword}>
        <Text style={styles.saveText}>Sauvegarder</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.saveBtn, styles.cancelBtn]} onPress={() => {
        setIsEditingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
      }}>
        <Text style={styles.saveText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  </>
) : (
  <View style={styles.rowBetween}>
    <Text style={styles.info}>**************</Text>
    <TouchableOpacity onPress={() => setIsEditingPassword(true)}>
      <Text style={styles.modify}>Modifier</Text>
    </TouchableOpacity>
  </View>
)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F5',
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 80, // Laisse la place pour le footer
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#E85421',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '90%',
    elevation: 3,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#212529',
  },
  info: {
    color: '#212529',
    marginTop: 2,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modify: {
    color: '#0E1E5B',
    fontWeight: 'bold',
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: '#0E1E5B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  cancelBtn: {
  backgroundColor: '#ccc',
  marginLeft: 10,
},
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  footerItem: {
    textAlign: 'center',
    fontSize: 12,
    color: '#212529',
  },
});