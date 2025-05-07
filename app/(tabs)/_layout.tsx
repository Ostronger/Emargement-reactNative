import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';


export default function RootLayout() {
  return (
    <Tabs
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof FontAwesome.glyphMap = 'home';

        if (route.name === 'Acceuil') {
          iconName = focused ? 'home' : 'home';
        } else if (route.name === 'Planning') {
          iconName = focused ? 'calendar' : 'calendar';
        } else if (route.name === 'Profil') {
          iconName = focused ? 'user' : 'user';
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#0E1E5B',
      tabBarInactiveTintColor: '#777',
      tabBarLabelStyle: { fontSize: 12 },
      headerShown: false,
    })}
  />
);
}