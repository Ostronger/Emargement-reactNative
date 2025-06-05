import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Session } from '../types/types';

export default function AccueilApprenantScreen() {
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [user, setUser] = useState<User | null>(null);
  const [coursAujourdhui, setCoursAujourdhui] = useState<Session[]>([]);
  const [coursPasses, setCoursPasses] = useState<Session[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');
        const parsedUser = userData ? JSON.parse(userData) : null;
        setUser(parsedUser);

        const response = await fetch(`${apiUrl}/api/apprenant/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const data = await response.json();
        setCoursAujourdhui(data.cours_aujourdhui || []);
        setCoursPasses(data.cours_passes || []);
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
      }
    };

    fetchData();
  }, []);

  const getInitiales = () => {
    if (!user) return '??';
    const prenom = user.firstname?.charAt(0) || '';
    const nom = user.lastname?.charAt(0) || '';
    return `${prenom}${nom}`.toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/Profil')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitiales()}</Text>
          </View>
        </TouchableOpacity>
        <Image source={require('../assets/images/gefor.jpg')} style={styles.logo} />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.welcome}>
          Bonjour {user?.firstname ?? 'Apprenant'}
        </Text>
        <TouchableOpacity
          style={styles.absenceBtn}
          onPress={() => router.push('/Accueil/justificatif')}
        >
          <Text style={styles.absenceBtnText}>Justifier une absence</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Emargement</Text>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.subTitle}>Aujourd'hui ({coursAujourdhui.length})</Text>
        {coursAujourdhui.map((cours, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.push({
                pathname: '/Accueil/feuille_emargement',
                params: { sessionId: cours.id.toString() },
              })
            }
          >
            <View style={styles.cardRed}>
              <Ionicons name="book" size={16} color="red" />
              <Text style={styles.cardText}>
                {cours.formation} - salle : {cours.salle}
              </Text>
              <Text style={styles.cardTime}>{cours.horaire}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.subTitle}>Passés - ({coursPasses.length})</Text>
        {coursPasses.map((cours, index) => (
          <View key={index} style={[styles.card, styles.pastCard]}>
            <Text style={styles.cardText}>{cours.formation}</Text>
            <Text style={styles.cardTime}>{cours.horaire}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F5',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
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
    paddingHorizontal: 20,
    alignItems: 'center',
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
  },
  scrollContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  subTitle: {
    fontWeight: 'bold',
    color: '#212529',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardRed: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: 'red',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardText: {
    fontWeight: '600',
    fontSize: 14,
  },
  cardTime: {
    color: '#6C757D',
    marginTop: 4,
  },
  pastCard: {
    opacity: 0.5,
  },
},
);