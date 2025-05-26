import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/apiService';

// 1. Création du contexte
const AuthContext = createContext();

// 2. Hook personnalisé pour utiliser le contexte dans les composants
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// 3. Provider qui englobe toute l'appli pour fournir le contexte à tous les composants enfants
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Utilisateur connecté
  const [loading, setLoading] = useState(true); // Chargement du contexte
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Statut de connexion

  // 4. Vérification de l'authentification à l'ouverture de l'appli
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 5. Fonction pour vérifier si l'utilisateur est déjà connecté (données stockées en local)
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

  // 6. Fonction de connexion (envoie username/password à l'API)
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

  // 7. Fonction de déconnexion (supprime les infos locales)
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // 8. Valeur du contexte fournie à tous les enfants
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  // 9. Fourniture du contexte à tous les composants enfants
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
