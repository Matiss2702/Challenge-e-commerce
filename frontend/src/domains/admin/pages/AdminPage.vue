<template>
  <div class="flex w-full min-h-screen admin-container">
    <!-- Sidebar -->
    <AdminSidebar />

    <div class="flex-1 p-5 admin-content">
      <h1 class="mb-5 text-2xl font-bold">Admin Dashboard</h1>
      <div class="mb-5 text-lg font-semibold stats-summary">Total utilisateurs : {{ adminStats?.totalUsers || 0 }}</div>

      <!-- Grille Tailwind à 12 colonnes -->
      <div class="grid grid-cols-12 gap-4">
        <!-- Widget 1 : Utilisateurs par année de naissance -->
        <div class="col-span-3">
          <div class="p-4 rounded shadow card">
            <canvas id="chart1"></canvas>
          </div>
        </div>
        <!-- Widget 2 : Top produits vendus -->
        <div class="col-span-3 col-start-4">
          <div class="p-4 rounded shadow card">
            <canvas id="chart2"></canvas>
          </div>
        </div>
        <!-- Widget 3 : Statistiques des commandes payées -->
        <div class="col-span-3 col-start-7">
          <div class="p-4 rounded shadow card">
            <canvas id="chart3"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref } from "vue";
import AdminSidebar from "@/domains/navigation/components/TheAdminSidebar.vue";
import { Chart, registerables } from "chart.js";
import { useAdminStore } from "@/stores/adminStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

// Enregistrer les modules Chart.js
Chart.register(...registerables);

const adminStore = useAdminStore();
const authStore = useAuthStore();
const router = useRouter();

const adminStats = ref(adminStore.stats);

onMounted(async () => {
  // Vérification de l'authentification et du rôle admin
  if (!authStore.user && authStore.token) {
    await authStore.verifyTokenAndRole();
  }
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  } else if (authStore.user.role !== "ROLE_ADMIN") {
    router.push("/forbidden");
    return;
  }

  // Récupérer les stats via le store
  await adminStore.fetchStats();
  adminStats.value = adminStore.stats;

  // Attendre que le DOM soit prêt pour que les canvas existent
  await nextTick();

  // Créer les graphiques si on a des données
  if (adminStats.value) {
    createUsersByBirthYearChart(adminStats.value.usersByBirthYear);
    createTopProductsChart(adminStats.value.topProducts);
    createPaidOrdersChart(adminStats.value.totalPaidOrders, adminStats.value.totalPaidAmount);
  }
});

// Fonction pour créer le graphique des utilisateurs par année de naissance
function createUsersByBirthYearChart(usersByBirthYear: { _id: number; count: number }[]) {
  const labels = usersByBirthYear.map((u) => u._id.toString());
  const data = usersByBirthYear.map((u) => u.count);

  const ctx = document.getElementById("chart1") as HTMLCanvasElement | null;
  if (!ctx) {
    console.error("Canvas chart1 not found");
    return;
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Utilisateurs par année de naissance",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Utilisateurs par année de naissance",
          font: { size: 16 },
          padding: { top: 10, bottom: 20 },
        },
      },
      scales: {
        x: { ticks: { font: { size: 14 } } },
        y: { ticks: { font: { size: 14 } } },
      },
    },
  });
}

// Fonction pour créer le graphique du top produits vendus
function createTopProductsChart(topProducts: { _id: string; totalQuantity: number; productInfo: { name: string } }[]) {
  const labels = topProducts.map((p) => p.productInfo.name);
  const data = topProducts.map((p) => p.totalQuantity);

  const ctx = document.getElementById("chart2") as HTMLCanvasElement | null;
  if (!ctx) {
    console.error("Canvas chart2 not found");
    return;
  }

  new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          label: "Top 5 produits vendus",
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: { font: { size: 14 }, padding: 15 },
        },
        title: {
          display: true,
          text: "Top 5 produits vendus",
          font: { size: 16 },
          padding: { top: 10, bottom: 20 },
        },
      },
    },
  });
}

// Fonction pour créer le graphique des commandes payées
function createPaidOrdersChart(totalPaidOrders: number, totalPaidAmount: number) {
  const ctx = document.getElementById("chart3") as HTMLCanvasElement | null;
  if (!ctx) {
    console.error("Canvas chart3 not found");
    return;
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Commandes payées", "Montant total (€)"],
      datasets: [
        {
          label: "Statistiques Paiements",
          data: [totalPaidOrders, totalPaidAmount],
          backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 159, 64, 0.2)"],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 159, 64, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { font: { size: 14 } },
        },
        x: {
          ticks: { font: { size: 14 } },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Commandes payées & Revenus",
          font: { size: 16 },
          padding: { top: 10, bottom: 20 },
        },
        legend: { display: false },
      },
    },
  });
}
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}
.admin-content {
  flex: 1;
  padding: 20px;
}
.stats-summary {
  margin-bottom: 20px;
}
</style>
