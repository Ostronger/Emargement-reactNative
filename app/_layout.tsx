// app/_layout.js
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext'; // NOUVEAU

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        {/* Tes autres écrans */}
      </Stack>
    </AuthProvider>
  );
}
