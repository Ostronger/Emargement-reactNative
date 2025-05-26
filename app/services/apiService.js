// services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'https://f4da-2001-41d0-fc22-6f12-1972-ec59-f07d-3279.ngrok-free.app/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Header pour contourner l'avertissement ngrok
  },
});

export const authService = {
  testConnection: async () => {
    try {
      console.log('Test de connexion à:', `${API_BASE_URL}/api/login`);
      const response = await apiClient.get('/api/login');
      console.log('Test réussi:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur de test:', error);
      throw error;
    }
  },

  login: async (username, password) => {
    try {
      console.log('Tentative de connexion POST à:', `${API_BASE_URL}/api/login`);
      console.log('Données envoyées:', { username, password });
      
      const response = await apiClient.post('/api/login', {
        username: username,
        password: password,
      });
      
      console.log('Réponse reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Erreur de connexion');
      } else if (error.request) {
        throw new Error('Impossible de joindre le serveur. Vérifiez votre connexion internet et l\'URL ngrok.');
      } else {
        throw new Error('Erreur de réseau');
      }
    }
  },
};

export default apiClient;
