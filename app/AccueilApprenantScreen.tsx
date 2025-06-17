import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Pressable,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Session } from '../types/types';

export default function AccueilApprenantScreen() {
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [user, setUser] = useState<User | null>(null);
  const [coursAujourdhui, setCoursAujourdhui] = useState<Session[]>([]);
  const [coursPasses, setCoursPasses] = useState<Session[]>([]);

   const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

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
        <Text style={styles.subTitle}>
          Aujourd'hui - {' '}
          <Text style={{ color: coursAujourdhui.length > 0 ? '#E85421' : '#6C757D' }}>
            ({coursAujourdhui.length})
          </Text>
        </Text>
        {coursAujourdhui.map((cours, index) => (
          <Pressable
            key={index}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() =>
              router.push({
                pathname: '/Accueil/feuille_emargement',
                params: { sessionId: cours.id.toString() },
              })
            }
          >
            <Animated.View style={[styles.cardRed, cours.active && styles.cardActive, { transform: [{ scale: scaleAnim }] },]}>
              <View style={styles.cardRow}>
                <FontAwesome5 name="book-open" size={20} color="#E85421" style={{ marginRight: 8 }} />
                <Text style={styles.cardText}>
                  {cours.formation} - salle : {cours.salle}
                </Text>
              </View>
              <Text style={styles.cardTime}>{cours.horaire}</Text>
            </Animated.View>
          </Pressable>
        ))}

        <Text style={styles.subTitle}>
          Passés - <Text style={{ color: '#6C757D' }}>({coursPasses.length})</Text>
        </Text>
        {coursPasses.map((cours, index) => (
          <View key={index} style={[styles.card, styles.pastCard]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <FontAwesome5 name="book" size={20} color="#6C757D" style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 14, color: '#212529', fontWeight: '600' }}>
                {cours.formation}
              </Text>
            </View>
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
    paddingTop: 20,
    gap: 10,
  },

  header: {
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'center', // Center the items
    gap: 16, // Space between items
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  avatar: {
    backgroundColor: '#E85421',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logo: {
    width: 160,
    height: 50,
    resizeMode: 'contain',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
     backgroundColor: '#fff',
     paddingVertical: 12, 
     marginTop: 12, 
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,            
  },
  sectionTitle: {
    backgroundColor: '#dee2e6',
    marginTop: 12, 
    paddingVertical: 12, 
    paddingHorizontal: 20,
    fontWeight: 'bold',
    color: '#212529',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  subTitle: {
    fontWeight: 'bold',
    color: '#212529',
    marginVertical: 10,
    textAlign: 'center',
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
  padding: 20, // augmenté
  borderRadius: 16, // légèrement plus arrondi
  marginBottom: 16, // plus d'espace entre les cartes
  minHeight: 100, // pour les rendre plus grandes visuellement
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
},
  cardText: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 10,
  },

  cardActive: {
  borderColor: '#E85421', // léger orange clair
  borderWidth: 2,
},
cardPressed: {
  backgroundColor: '#f3f3f3',
},

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    
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