import { defineStore } from "pinia";
import axios from "axios";
import router from "@/router";
import { toast } from "../components/ui/toast/use-toast";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: null as any | null,
    isLoadingUser: false,
  }),

  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/auth/login`, credentials);
        this.token = response.data.token;
        localStorage.setItem("token", this.token);
        await this.fetchUser();
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
          variant: "default",
        });
        router.push("/profile");
      } catch (error: any) {
        console.error("Erreur lors de la connexion:", error);
        toast({
          title: "Erreur de connexion",
          description: error.response?.data?.message || "Impossible de se connecter. Veuillez réessayer.",
          variant: "destructive",
        });
        throw new Error("Échec de la connexion.");
      }
    },

    async register(data: { name: string; birthdate: string; email: string; password: string }) {
      try {
        await axios.post(`${apiBaseUrl}/api/auth/register`, data);
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
          variant: "default",
        });
        router.push("/check-email");
      } catch (error: any) {
        console.error("Erreur lors de l'inscription:", error);
        toast({
          title: "Erreur d'inscription",
          description: error.response?.data?.message || "L'inscription a échoué. Veuillez réessayer.",
          variant: "destructive",
        });
        throw new Error("Échec de l'inscription.");
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
      } catch (error: any) {
        console.error("Erreur lors de la récupération des informations utilisateur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les informations utilisateur.",
          variant: "destructive",
        });
        this.logout();
      } finally {
        this.isLoadingUser = false;
      }
    },

    async verifyTokenAndRole(requiredRole?: string | string[]) {
      if (!this.token) {
        toast({
          title: "Erreur",
          description: "Vous n'êtes pas connecté.",
          variant: "destructive",
        });
        router.push("/auth/login");
        return false;
      }

      try {
        await this.fetchUser();
        if (requiredRole) {
          const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
          if (!roles.includes(this.user?.role)) {
            toast({
              title: "Accès refusé",
              description: "Vous n'avez pas les autorisations nécessaires pour accéder à cette page.",
              variant: "destructive",
            });
            router.push("/forbidden");
            return false;
          }
        }
        return true;
      } catch (error: any) {
        console.error("Erreur lors de la vérification du rôle:", error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier votre rôle. Veuillez réessayer.",
          variant: "destructive",
        });
        return false;
      }
    },

    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
        variant: "default",
      });
      router.push("/");
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    hasRole:
      (state) =>
      (role: string | string[]): boolean => {
        if (Array.isArray(role)) {
          return role.includes(state.user?.role);
        }
        return state.user?.role === role;
      },
  },
});
