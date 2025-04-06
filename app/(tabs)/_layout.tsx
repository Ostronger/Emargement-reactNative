import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


export default function RootLayout() {
  return (
    <Tabs
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';

        if (route.name === 'acceuil') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'planning') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'profil') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#0E1E5B',
      tabBarInactiveTintColor: '#777',
      tabBarLabelStyle: { fontSize: 12 },
      headerShown: false,
    })}
  />
);
}