import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { apprenantService } from './services/apiService';
import { useAuth } from './context/AuthContext'; 


export default function AccueilApprenantScreen() {
  const router = useRouter();
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // pour accéder à l'utilisateur

  useEffect(() => {
    fetchCours();
  }, []);

  const fetchCours = async () => {
    try {
      const response = await apprenantService.getCoursApprenant();
      setCours(response.data); // attendu sous clé 'data'
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Impossible de charger les cours');
    } finally {
      setLoading(false);
    }
  };
  const getInitiales = () => {
  if (!user) return '??';
  const prenom = user.firstname?.[0] || '';
  const nom = user.lastname?.[0] || '';
  return `${prenom}${nom}`.toUpperCase();
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/Profil')}>
          <Text style={styles.avatarText}>{getInitiales()}</Text>

        </TouchableOpacity>
        <Image source={require('../assets/images/gefor.jpg')} style={styles.logo} />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.welcome}>Bonjour Apprenant</Text>
        <TouchableOpacity
          style={styles.absenceBtn}
          onPress={() => router.push('/Accueil/justificatif')}
        >
          <Text style={styles.absenceBtnText}>Justifier une absence</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Mes cours à venir</Text>

      <ScrollView style={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0E1E5B" />
        ) : cours.length === 0 ? (
          <Text style={styles.subTitle}>Aucun cours trouvé.</Text>
        ) : (
          cours.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push('/Accueil/feuille_emargement')}
            >
              <View style={styles.card}>
                <Ionicons name="book" size={16} color="#0E1E5B" />
                <Text style={styles.cardText}>{item.titre}</Text>
                <Text style={styles.cardTime}>{item.horaire}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// ... styles restent identiques (repris depuis ta version actuelle)
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
  cardText: {
    fontWeight: '600',
    fontSize: 14,
  },
  cardTime: {
    color: '#6C757D',
    marginTop: 4,
  },
});
