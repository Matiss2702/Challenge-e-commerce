import { defineStore } from 'pinia';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null as any | null,
  }),

  actions: {
    async login(credentials: { email: string; password: string }, router: any) {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/auth/login`, credentials);
        console.log('Réponse du serveur:', response.data);

        this.token = response.data.token;
        console.log('Token reçu:', this.token);

        if (this.token) {
          localStorage.setItem('token', this.token);
          console.log('Token enregistré dans localStorage.');
          await this.fetchUser();
          this.redirectToProfile(router);
        } else {
          console.error('Le token est manquant dans la réponse.');
          throw new Error('Token is missing in the server response.');
        }
      } catch (error) {
        console.error('Erreur de connexion:', error);
        throw new Error('Login failed. Please check your credentials.');
      }
    },

    async register(data: { name: string; email: string; password: string; role: string }, router: any) {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/auth/register`, data);
        console.log('Réponse de l\'inscription:', response.data);
        this.token = response.data.token;

        if (this.token) {
          localStorage.setItem('token', this.token);
          console.log('Token enregistré dans localStorage après inscription.');
          await this.fetchUser();
          this.redirectToProfile(router);
        } else {
          console.error('Le token est manquant dans la réponse.');
          throw new Error('Token is missing in the server response.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        throw new Error('Registration failed. Please check your details.');
      }
    },

    async fetchUser() {
      try {
        if (this.token !== null) {
          console.log('Récupération des informations utilisateur...');
          const response = await axios.get(`${apiBaseUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${this.token}` },
          });
          this.user = response.data;
          console.log('Informations utilisateur récupérées:', this.user);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      }
    },

    logout(router: any) {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      console.log('Utilisateur déconnecté et token supprimé du stockage local.');
      
      if (router) {
        router.push('/');
      } else {
        console.error('Router is undefined.');
      }
    },
    
    redirectToProfile(router: any) {
      router.push('/profile');
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    hasRole: (state) => (role: string) => state.user?.role === role,
  },
});
