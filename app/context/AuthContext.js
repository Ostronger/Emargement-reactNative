// context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/apiService';

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte facilement
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Provider global pour gérer l'utilisateur connecté
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // utilisateur actuel
  const [loading, setLoading] = useState(true); // état de chargement
  const [isAuthenticated, setIsAuthenticated] = useState(false); // statut de connexion

  // Vérifie à l'ouverture si un utilisateur est stocké localement
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'auth:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de connexion
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await authService.login(username, password);

      if (response.success) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion : supprime les données locales
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
