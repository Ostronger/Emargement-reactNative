import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignatureScreen from 'react-native-signature-canvas';
import signatureStyles, { signatureWebStyle } from '../styles/signature.style';

export default function FeuilleEmargementScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();

  const [showModal, setShowModal] = useState(false);
  const [session, setSession] = useState<any>(null);
  const ref = useRef<any>(null);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${apiUrl}/api/apprenant/signature/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const data = await res.json();
        setSession(data);
      } catch (err) {
        Alert.alert("Erreur", "Impossible de charger les données.");
      }
    };

    if (sessionId) fetchSession();
  }, [sessionId]);

  const handleOK = async (signature: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/apprenant/signature/${sessionId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signatureData: signature }),
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert('Succès', result.message || 'Signature enregistrée');
        setSession({ ...session, alreadySigned: true });
      } else {
        Alert.alert('Erreur', result.message || 'Échec de la signature');
      }
    } catch (err) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l’envoi de la signature.');
    } finally {
      setShowModal(false);
    }
  };

  const handleEmpty = () => {
    Alert.alert('Erreur', 'Signature vide');
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const { active, alreadySigned, formation, salle, horaire, formateur } = session;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/Profil')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AK</Text>
          </View>
        </TouchableOpacity>
        <Image source={require('../assets/images/gefor.jpg')} style={styles.logo} />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.welcome}>Bonjour Apprenant</Text>
        <TouchableOpacity style={styles.absenceBtn} onPress={() => router.push('/Accueil/justificatif')}>
          <Text style={styles.absenceBtnText}>Justifier une absence</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>{formation}</Text>

      <View style={styles.card}>
        <Ionicons name="book" size={16} color="#0E1E5B" />
        <Text style={styles.cardText}>{formation} - {salle}</Text>
        <Text style={styles.cardTime}>{horaire}</Text>
        <Text style={styles.cardProf}>👤 Intervenant</Text>
        <Text style={styles.profName}>{formateur}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.signBtn,
          (!active || alreadySigned) && styles.signBtnDisabled
        ]}
        onPress={() => {
          if (alreadySigned) {
            Alert.alert("Déjà signé", "Vous avez déjà signé cette session.");
          } else if (!active) {
            Alert.alert("Session inactive", "La session n’est pas encore active.");
          } else {
            setShowModal(true);
          }
        }}
        disabled={!active || alreadySigned}
      >
        <Text style={styles.signBtnText}>
          {alreadySigned ? 'Déjà signé' : active ? 'Signer' : 'Session inactive'}
        </Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide">
        <View style={signatureStyles.modalContainer}>
          <Text style={signatureStyles.title}>Veuillez signer dans le cadre</Text>
          <View style={signatureStyles.signatureContainer}>
            <SignatureScreen
              ref={ref}
              onOK={handleOK}
              onEmpty={handleEmpty}
              descriptionText=""
              webStyle={signatureWebStyle}
            />
          </View>
          <TouchableOpacity style={signatureStyles.saveButton} onPress={() => ref.current?.readSignature()}>
            <Text style={signatureStyles.saveButtonText}>Sauvegarder</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowModal(false)}>
            <Text style={{ textAlign: 'center', color: '#E85421', marginTop: 10 }}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F5',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: '#E85421',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  welcome: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0E1E5B',
  },
  absenceBtn: {
    backgroundColor: '#0E1E5B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  absenceBtnText: {
    color: 'white',
    fontWeight: '600',
  },
  sectionTitle: {
    backgroundColor: '#dee2e6',
    padding: 10,
    fontWeight: 'bold',
    color: '#212529',
    fontSize: 16,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 10,
  },
  cardTime: {
    color: '#6C757D',
    marginTop: 4,
  },
  cardProf: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#212529',
  },
  profName: {
    color: '#212529',
  },
  signBtn: {
    backgroundColor: '#0E1E5B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  signBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  signBtnDisabled: {
  backgroundColor: '#ccc',
},
});