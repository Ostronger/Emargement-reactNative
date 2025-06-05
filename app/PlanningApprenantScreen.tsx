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

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avr.','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
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
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState<{ [key: string]: Course[] }>({});
  const [markedDates, setMarkedDates] = useState({});
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Course[] = await res.json();

      const grouped: { [key: string]: Course[] } = {};
      const marks: any = {};

      data.forEach(event => {
        const date = event.start.split('T')[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(event);
        marks[date] = {
          marked: true,
          dotColor: '#E85421',
          selected: selectedDate === date,
          selectedColor: selectedDate === date ? '#0E1E5B' : undefined,
        };
      });

      setEvents(grouped);
      setMarkedDates(marks);
    } catch (error) {
      Alert.alert('Erreur', "Impossible de charger le planning.");
    }
  };

  const formatTimeRange = (start: string, end: string): string => {
    const s = new Date(start);
    const e = new Date(end);
    return `${s.getHours()}h${s.getMinutes().toString().padStart(2, '0')} - ${e.getHours()}h${e.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/Profil')}>
            <View style={styles.avatar}><Text style={styles.avatarText}>AK</Text></View>
          </TouchableOpacity>
          <Image source={require('../assets/images/gefor.jpg')} style={styles.logo} />
        </View>

        <Text style={styles.pageTitle}>Planning</Text>

        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            calendarBackground: '#E85421',
            selectedDayBackgroundColor: '#E85421',
            todayTextColor: '#E85421',
            arrowColor: '#E85421',
          }}
        />

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
              <Text style={styles.courseSalle}>📍 {item.salle}</Text>
              <Text style={styles.courseProf}>👤 {item.extendedProps.formateur}</Text>
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
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  avatar: { backgroundColor: '#ccc', borderRadius: 20, padding: 10 },
  avatarText: { color: 'white', fontWeight: 'bold' },
  logo: { width: 100, height: 40 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subTitle: { fontSize: 18, marginTop: 10, marginBottom: 6 },
  courseCard: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 10 },
  courseTitle: { fontSize: 16, fontWeight: 'bold' },
  courseTime: { color: '#555' },
  courseSalle: { color: '#333' },
  courseProf: { color: '#333' },
  justification: { marginTop: 5, fontStyle: 'italic', color: '#E85421' },
});