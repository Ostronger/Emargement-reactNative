// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérification de l'authentification au démarrage de l'app
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
        console.log('Utilisateur trouvé dans le stockage:', parsedUser);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      console.log('Tentative de connexion pour:', username);
      
      const response = await authService.login(username, password);
      
      if (response.success) {
        // Stockage des données utilisateur dans AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        setUser(response.user);
        setIsAuthenticated(true);
        
        console.log('Connexion réussie pour:', response.user.username);
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
