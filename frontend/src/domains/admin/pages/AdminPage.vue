<template>
    <div class="admin-container">
      <!-- Sidebar for admin -->
      <AdminSidebar />
      
      <div class="admin-content">
        <h1>Admin Dashboard</h1>
    
        <!-- Gridstack container -->
        <div class="grid-stack" ref="gridstack">
          <!-- Example grid items -->
          <div class="grid-stack-item" gs-x="0" gs-y="0" gs-width="4" gs-height="2">
            <div class="grid-stack-item-content card">
              <canvas id="chart1"></canvas>
            </div>
          </div>
          <div class="grid-stack-item" gs-x="4" gs-y="0" gs-width="4" gs-height="2">
            <div class="grid-stack-item-content card">
              <canvas id="chart2"></canvas>
            </div>
          </div>
          <div class="grid-stack-item" gs-x="0" gs-y="2" gs-width="8" gs-height="2">
            <div class="grid-stack-item-content card">
              <canvas id="chart3"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useAuthStore } from '@/stores/authStore';
  import { GridStack } from 'gridstack';
  import 'gridstack/dist/gridstack.min.css';
  import AdminSidebar from '@/domains/navigation/components/TheAdminSidebar.vue';
  import { Chart, registerables } from 'chart.js'; // Importer tous les modules nécessaires de Chart.js
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  // Enregistrer tous les composants de Chart.js
  Chart.register(...registerables);
  
  onMounted(async () => {
    if (!authStore.user && authStore.token) {
      await authStore.verifyTokenAndRole();
    }
  
    if (!authStore.isAuthenticated) {
      router.push('/login'); // Rediriger si non authentifié
    } else if (authStore.user.role !== 'ROLE_ADMIN') {
      router.push('/forbidden'); // Rediriger si l'utilisateur n'est pas admin
    } else {
      // Initialiser gridstack et les graphiques uniquement si authentifié et admin
      initializeDashboard();
    }
  });
  
  function initializeDashboard() {
    // Initialiser gridstack
    const gridstack = GridStack.init();
  
    // Initialiser les graphiques
    createChart('chart1');
    createChart('chart2');
    createChart('chart3');
  }
  
  function createChart(chartId) {
    new Chart(document.getElementById(chartId), {
      type: 'bar', // Le type de graphique que tu veux créer (assure-toi que 'bar' est enregistré)
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Sales',
          data: [12, 19, 3, 5, 2],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
  </script>
  
  
  <style scoped>
  .admin-container {
    display: flex;
  }
  
  .admin-content {
    width: 100%;
    padding: 20px;
  }
  
  .grid-stack {
    width: 100%;
    margin-left: 20px; /* Give space for the sidebar */
  }
  
  .card {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    height: 100%; /* Fill the grid item */
  }
</style>
  