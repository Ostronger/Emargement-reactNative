import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerAsset } from 'expo-document-picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JustificatifAbsenceScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [motifDetails, setMotifDetails] = useState('');
  const [sessionsPassees, setSessionsPassees] = useState<any[]>([]);
  const [sessionsFutures, setSessionsFutures] = useState<any[]>([]);
  const [selectedPassees, setSelectedPassees] = useState<number[]>([]);
  const [selectedFutures, setSelectedFutures] = useState<number[]>([]);
  const [document, setDocument] = useState<DocumentPickerAsset | null>(null);
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/apprenant/absence/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSessionsPassees(data.sessionsPassees);
        setSessionsFutures(data.sessionsFutures);
      }
    };

    fetchSessions();
  }, []);

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets?.length > 0) {
      setDocument(result.assets[0]);
    }
  };

  const toggleSelection = (id: number, type: 'passee' | 'future') => {
    const setter = type === 'passee' ? setSelectedPassees : setSelectedFutures;
    const selected = type === 'passee' ? selectedPassees : selectedFutures;
    setter(selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id]);
  };

  const handleSubmit = async () => {
    if (!motifDetails || !document || !accepted || (selectedPassees.length + selectedFutures.length) === 0) {
      Alert.alert('Veuillez remplir tous les champs, sélectionner au moins une session et accepter les conditions.');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    selectedPassees.forEach(id => formData.append('sessionsPassees[]', id.toString()));
    selectedFutures.forEach(id => formData.append('sessionsFutures[]', id.toString()));
    formData.append('motifDetails', motifDetails);
    formData.append('document', {
      uri: document.uri,
      name: document.name,
      type: document.mimeType || 'application/pdf',
    } as any);

    try {
      const res = await fetch(`${apiUrl}/api/apprenant/justifier-absence`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        Alert.alert('Justification envoyée avec succès');
        router.push('/Planning');
      } else {
        Alert.alert('Erreur', json.message || 'Erreur lors de l’envoi.');
      }
    } catch (e: any) {
      Alert.alert('Erreur réseau', e.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/Profil')}>
          <Text style={styles.avatarText}>AK</Text>
        </TouchableOpacity>
        <Image source={require('../assets/images/gefor.jpg')} style={styles.logo} />
      </View>

      <Text style={styles.pageTitle}>Justifier une absence</Text>

      <View style={styles.card}>
        <Text style={styles.description}>Sélectionnez les sessions concernées :</Text>

        <Text style={styles.sectionTitle}>Absences passées</Text>
        {sessionsPassees.map(session => (
          <TouchableOpacity
            key={session.id}
            onPress={() => toggleSelection(session.id, 'passee')}
            style={[
              styles.sessionItem,
              selectedPassees.includes(session.id) && styles.selectedItem,
            ]}
          >
            <Text>{session.formation} - {session.date}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Absences futures</Text>
        {sessionsFutures.map(session => (
          <TouchableOpacity
            key={session.id}
            onPress={() => toggleSelection(session.id, 'future')}
            style={[
              styles.sessionItem,
              selectedFutures.includes(session.id) && styles.selectedItem,
            ]}
          >
            <Text>{session.formation} - {session.date}</Text>
          </TouchableOpacity>
        ))}

        <TextInput
          placeholder="Détails de la justification"
          style={styles.input}
          value={motifDetails}
          onChangeText={setMotifDetails}
        />

        <TouchableOpacity style={styles.uploadBtn} onPress={handlePickDocument}>
          <Text style={styles.uploadBtnText}>{document ? document.name : 'Choisir un document'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAccepted(!accepted)}>
          <View style={accepted ? styles.checkboxChecked : styles.checkbox} />
          <Text style={styles.termsText}>
            En validant votre demande de justification d'absence, vous acceptez que vos données soient stockées...
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Envoyer un justificatif</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F1F3F5', 
    paddingTop: 40, paddingHorizontal: 20 
  },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  
  avatar: { 
    backgroundColor: '#E85421', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  
  avatarText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  
  logo: { 
    width: 100, 
    height: 30, 
    resizeMode: 'contain' 
  },
  
  pageTitle: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginBottom: 15, 
    color: '#0E1E5B' 
  },
  
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 20, 
    elevation: 3 
  },
  
  description: { 
    marginBottom: 10, 
    color: '#212529' 
  },
  
  input: { 
    backgroundColor: '#fff', 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 10 
  },
  
  uploadBtn: { 
    backgroundColor: '#eee', 
    padding: 10, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 10 
  },
  
  uploadBtnText: { 
    color: '#0E1E5B' 
  },
  
  checkboxContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginVertical: 10 
  },
  
  termsText: { 
    fontSize: 12, 
    color: '#212529', 
    flex: 1 
  },
  
  submitBtn: { 
    backgroundColor: '#0E1E5B', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  
  submitText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },

  sectionTitle: { fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  sessionItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 5,
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
    borderColor: '#0E1E5B',
  },
  checkbox: {
    width: 20, height: 20, borderWidth: 2, borderColor: '#f26522', marginRight: 10,
  },
  checkboxChecked: {
    width: 20, height: 20, backgroundColor: '#f26522', marginRight: 10,
  },
});