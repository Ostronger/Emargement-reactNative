import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function ProfilApprenantScreen() {
  const [username, setUsername] = useState('Akasa');
  const [email, setEmail] = useState('kihjg@ghgqg.fr');
  const [password, setPassword] = useState('************');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleSave = () => {
    if (isEditingPassword && newPassword.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    console.log('Infos enregistrées:', {
      username,
      email,
      newPassword,
    });
    setIsEditingPassword(false);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/gefor.jpg')} style={styles.logo} />

      <Text style={styles.title}>Profil</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>AK</Text>
      </View>

      <Text style={styles.name}>ARIS KASA</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nom utilisateur</Text>
        <Text style={styles.info}>{username}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.info}>{email}</Text>

        <Text style={styles.label}>Mot de passe</Text>
        {isEditingPassword ? (
          <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        ) : (
          <View style={styles.rowBetween}>
            <Text style={styles.info}>{password}</Text>
            <TouchableOpacity onPress={() => setIsEditingPassword(true)}>
              <Text style={styles.modify}>Modifier</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Sauvegarder</Text>
      </TouchableOpacity>
    </View>
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