
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CoursPassesList({ cours }) {
  return (
    <View>
      <Text style={styles.subTitle}>Passés - ({cours.length})</Text>
      {cours.map((c) => (
        <View style={[styles.card, styles.pastCard]} key={c.id}>
          <Text style={styles.cardText}>{c.nom}</Text>
          <Text style={styles.cardTime}>{c.horaire}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
  pastCard: {
    opacity: 0.5,
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
