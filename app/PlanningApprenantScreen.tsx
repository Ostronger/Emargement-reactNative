import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/types';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avr.','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['L','M','M','J','V','S','D'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

type Course = {
  eventId: number;
  title: string;
  start: string;
  end: string;
  salle: string;
  extendedProps: {
    formateur: string;
    justification?: string;
    role: string;
  };
};

export default function PlanningApprenantScreen() {
  const todayString = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [events, setEvents] = useState<{ [key: string]: Course[] }>({});
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;


  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      const parsedUser = userData ? JSON.parse(userData) : null;
      setUser(parsedUser);
    };

    loadUser();
  }, []);

  

  useEffect(() => {
    const today = new Date();
    const year = today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
    const start = `${year}-09-01`;
    const endDate = `${year + 1}-06-30`;
    fetchPlanning(start, endDate);
  }, []);

  

  const fetchPlanning = async (start: string, end: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/planning?start=${start}&end=${end}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: Course[] = await res.json();
      const grouped: { [key: string]: Course[] } = {};

      data.forEach(event => {
        const date = event.start.split('T')[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(event);
      });

      setEvents(grouped);
    } catch (error) {
      Alert.alert('Erreur', "Impossible de charger le planning.");
    }
  };

  const generateMarkedDates = () => {
    const marks: any = {};

    // Marquer les dates ayant des événements
    Object.keys(events).forEach(date => {
      marks[date] = {
        marked: true,
        dotColor: '#FFFFFF',
      };
    });

    // Marquer le jour d'aujourd'hui avec surbrillance bleue si aucune date sélectionnée
    marks[todayString] = {
      selected: true,
      selectedColor: '#0E1E5B',
      selectedTextColor: '#FFFFFF',
    };

    // Si l'utilisateur sélectionne une date, on la surligne à la place de today
    if (selectedDate !== todayString) {
      marks[selectedDate] = {
        selected: true,
        selectedColor: '#0E1E5B',
        selectedTextColor: '#FFFFFF',
      };
    }

    return marks;
  };

  const formatTimeRange = (start: string, end: string): string => {
    const s = new Date(start);
    const e = new Date(end);
    return `${s.getHours()}h${s.getMinutes().toString().padStart(2, '0')} - ${e.getHours()}h${e.getMinutes().toString().padStart(2, '0')}`;
  };

  const getInitiales = () => {
    if (!user) return '??';
    const prenom = user.firstname?.charAt(0) || '';
    const nom = user.lastname?.charAt(0) || '';
    return `${prenom}${nom}`.toUpperCase();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/Profil')}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{getInitiales()}</Text></View>
          </TouchableOpacity>
          <Image source={require('../assets/images/gefor.jpg')} style={styles.logo} />
        </View>

        <Text style={styles.pageTitle}>Planning</Text>

      <View style={{ paddingHorizontal: 16, paddingTop: 10, }}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={generateMarkedDates()}
          theme={{
            calendarBackground: '#E85421',
            selectedDayBackgroundColor: '#0E1E5B',
            todayTextColor: '#FFFFFF',
            arrowColor: '#FFFFFF',
            dayTextColor: '#FFFFFF',
            textDisabledColor: '#999999',
            monthTextColor: '#FFFFFF',
            textMonthFontWeight: 'bold',
            textDayFontWeight: 'bold',
          }}
        />
</View>
        <Text style={styles.subTitle}>
          {selectedDate ? formatDate(selectedDate) : "Sélectionnez une date"} ({events[selectedDate]?.length || 0})
        </Text>

        <FlatList
          data={events[selectedDate] || []}
          keyExtractor={(item) => item.eventId.toString()}
          renderItem={({ item }) => (
            <View style={styles.courseCard}>
  <Text style={styles.courseTitle}>{item.title}</Text>
  <Text style={styles.courseTime}>{formatTimeRange(item.start, item.end)}</Text>

  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
    <FontAwesome name="map-marker" size={16} color="#E85421" style={{ marginRight: 6 }} />
    <Text style={styles.courseSalle}>{item.salle}</Text>
  </View>

  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
    <FontAwesome5 name="user" size={16} color="#0E1E5B" style={{ marginRight: 6 }} />
    <Text style={styles.courseProf}>{item.extendedProps.formateur}</Text>
  </View>

  {item.extendedProps.justification && (
    <Text style={styles.justification}>{item.extendedProps.justification}</Text>
  )}
</View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3F5",
    paddingTop: 20,
    gap: 10,
  },
   header: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  avatar: {
    backgroundColor: "#E85421",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  logo: {
    width: 160,
    height: 50,
    resizeMode: "contain",
  },
  pageTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 17,
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
    marginLeft: 8,
  },

  courseCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 8,
    elevation: 2,
    paddingHorizontal: 16,
  },
  courseTitle: { 
    fontSize: 16, 
    fontWeight: 'bold',
  },
  
  courseTime: { 
    color: '#555', 
  },
  courseSalle: { 
    color: '#333',
  },
  courseProf: { 
    color: '#333',
  },
  justification: { 
    marginTop: 5, 
    fontStyle: 'italic', 
    color: '#E85421', 
  },
});
