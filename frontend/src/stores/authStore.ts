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
    async login(credentials: { email: string, password: string }) {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/auth/login`, credentials);
        
        this.token = response.data.token;
        localStorage.setItem('token', this.token);

        await this.fetchUser();
        router.push('/profile');
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw new Error('Login failed. Please check your credentials.');
      }
    },

    async register(data: { name: string, birthdate: string, email: string, password: string }) {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/auth/register`, data);
        
        this.token = response.data.token;
        localStorage.setItem('token', this.token);

        await this.fetchUser();
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        throw new Error('Registration failed. Please try again.');
      }
    },

    async fetchUser() {
      if (!this.token) return;

      this.isLoadingUser = true;
      try {
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

    async verifyTokenAndRole() {
      if (this.token) {
        await this.fetchUser();
      }
    },

    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    hasRole: (state) => (role: string) => state.user?.role === role,
  },
});
