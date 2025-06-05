// services/apiService.js

const API_BASE_URL = 'https://1358-2a01-e0a-217-2e80-d855-86cf-4fa7-a44f.ngrok-free.app/';

// Headers utilisés pour toutes les requêtes
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

// Fonction utilitaire fetch
async function fetchJSON(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erreur inconnue');
  }

  return data;
}

export const authService = {
  // Permet de tester si l'API est joignable
  testConnection: async () => {
    return await fetchJSON('/api/login');
  },

  // Envoie les identifiants pour tenter une connexion
  login: async (username, password) => {
    return await fetchJSON('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

export const apprenantService = {
  getCoursApprenant: async () => {
    return await fetchJSON('/api/apprenant/sessions');
  },
};

