// src/stores/adminStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export interface UsersByYear {
  _id: number; // année
  count: number;
}

export interface TopProduct {
  _id: string;
  totalQuantity: number;
  productInfo: {
    name: string;
  };
}

export interface OrderStatus {
  _id: string; // statut de commande
  count: number;
}

// Modification ici : on remplace usersByYear par usersByBirthYear
export interface AdminStats {
  totalUsers: number;
  usersByBirthYear: UsersByYear[];
  topProducts: TopProduct[];
  totalPaidOrders: number;
  totalPaidAmount: number;
}

export const useAdminStore = defineStore("admin", () => {
  // Etat réactif pour stocker les stats
  const stats = ref<AdminStats | null>(null);

  const authStore = useAuthStore();
  const authHeaders = computed(() => ({
    Authorization: `Bearer ${authStore.token}`,
  }));

  // Fonction pour récupérer les stats depuis l'API admin
  async function fetchStats() {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/admin/stats`, {
        headers: authHeaders.value,
      });
      stats.value = res.data;
    } catch (err) {
      console.error("Erreur fetchStats:", err);
      stats.value = null;
    }
  }

  return {
    stats,
    fetchStats,
  };
});
