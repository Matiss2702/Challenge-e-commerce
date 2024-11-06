import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null as any | null,
    isLoadingUser: false,
  }),

  actions: {
    // Action de connexion
    async login(credentials: { email: string, password: string }) {
      try {
        // Effectuer l'appel API vers le point de connexion
        const response = await axios.post(`${apiBaseUrl}/api/auth/login`, credentials);

        // Stocker le token reçu et le sauvegarder dans le localStorage
        this.token = response.data.token;
        localStorage.setItem('token', this.token);

        // Récupérer les détails de l'utilisateur après la connexion
        await this.fetchUser();
        router.push('/profile');
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.');
      }
    },

    // Action d'inscription
    async register(data: { name: string, birthdate: string, email: string, password: string }) {
      try {
        // Effectuer l'appel API vers le point d'inscription
        const response = await axios.post(`${apiBaseUrl}/api/auth/register`, data);

        // Stocker le token reçu et le sauvegarder dans le localStorage
        this.token = response.data.token;
        localStorage.setItem('token', this.token);

        // Récupérer les détails de l'utilisateur après l'inscription
        await this.fetchUser();
        router.push('/profile');
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        throw new Error("Échec de l'inscription. Veuillez réessayer.");
      }
    },

    // Récupérer les détails de l'utilisateur en fonction du token
    async fetchUser() {
      if (!this.token) return;

      this.isLoadingUser = true;
      try {
        // Effectuer l'appel API pour récupérer les informations de l'utilisateur
        const response = await axios.get(`${apiBaseUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
        this.logout();
      } finally {
        this.isLoadingUser = false;
      }
    },

    // Vérifier le token et le rôle, utilisé pour valider si l'utilisateur a une autorisation adéquate
    async verifyTokenAndRole() {
      if (this.token) {
        await this.fetchUser();
      }
    },

    // Action de déconnexion
    logout() {
      // Effacer le token et les détails de l'utilisateur de l'état et du localStorage
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      router.push('/');
    },
  },

  getters: {
    // Vérifier si l'utilisateur est authentifié en fonction du token et des données utilisateur
    isAuthenticated: (state) => !!state.token && !!state.user,

    // Vérifier si l'utilisateur a un rôle spécifique
    hasRole: (state) => (role: string) => {
      console.log('Vérification du rôle utilisateur:', state.user?.role);
      return state.user?.role === role;
    },
  },
});
