import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerAsset } from 'expo-document-picker';
import { useRouter } from 'expo-router';


export default function JustificatifAbsenceScreen() {
  const [justification, setJustification] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [document, setDocument] = useState<DocumentPickerAsset | null>(null);
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setDocument(file);
    }
  };

  const handleSubmit = () => {
    if (justification && startDate && endDate && document && accepted) {
      console.log('Formulaire envoyé avec :', {
        justification,
        startDate,
        endDate,
        document,
      });
    } else {
      alert('Veuillez remplir tous les champs et accepter les conditions.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profil')}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>AK</Text>
                  </View>
                </TouchableOpacity>
        <Image source={require('../assets/images/gefor.jpg')} style={styles.logo} />
      </View>

      <Text style={styles.pageTitle}>Justifier une absence</Text>

      <View style={styles.card}>
        <Text style={styles.description}>
          La demande de justification sera envoyée à un administrateur pour validation.
        </Text>

        <TextInput
          placeholder="Justification"
          style={styles.input}
          value={justification}
          onChangeText={setJustification}
        />

        <TextInput
          placeholder="Date de début"
          style={styles.input}
          value={startDate}
          onChangeText={setStartDate}
        />

        <TextInput
          placeholder="Date de fin"
          style={styles.input}
          value={endDate}
          onChangeText={setEndDate}
        />

        <TouchableOpacity style={styles.uploadBtn} onPress={handlePickDocument}>
          <Text style={styles.uploadBtnText}>{document ? document.name : 'Choisir un document'}</Text>
        </TouchableOpacity>

        {/* ✅ Checkbox personnalisée */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAccepted(!accepted)}
        >
          <View style={{
            width: 20,
            height: 20,
            borderWidth: 2,
            borderColor: '#f26522',
            backgroundColor: accepted ? '#f26522' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}>
            {accepted && <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>}
          </View>
          <Text style={styles.termsText}>
            En validant votre demande de justification d'absence, vous acceptez que vos données puissent être stockées pour la durée maximale légale de conservation. Vos données seront traitées dans le cadre du service proposé par GEFOR à l'organisation à laquelle vous appartenez, afin de justifier votre absence en formation.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Envoyer un justificatif</Text>
        </TouchableOpacity>
      </View>
    </View>
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
});