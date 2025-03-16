<template>
  <div class="admin-container">
    <AdminSidebar />

    <div class="p-4 admin-content">
      <h1 class="mb-4 text-2xl font-bold">Gestion des Utilisateurs</h1>

      <button class="px-4 py-2 mb-4 text-white bg-blue-500 rounded" @click="goToForm()">Ajouter un Utilisateur</button>

      <!-- Conteneur scrollable pour le tableau -->
      <div class="overflow-x-auto table-container">
        <Table>
          <TableCaption>Liste des utilisateurs enregistrés</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in paginatedUsers" :key="user.id">
              <TableCell>{{ user.name }}</TableCell>
              <TableCell>{{ user.email }}</TableCell>
              <TableCell>{{ user.role }}</TableCell>
              <TableCell>
                <button class="mr-2 text-yellow-500" @click="goToForm(user.id)" aria-label="Modifier">
                  <EditIcon class="w-6 h-6" />
                </button>
                <button class="text-red-500" @click="deleteUser(user.id)" aria-label="Supprimer">
                  <TrashIcon class="w-6 h-6" />
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter v-if="paginatedUsers.length === 0">
            <TableRow>
              <TableCell colspan="4" class="text-center text-gray-500"> Aucun utilisateur trouvé. </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <button :disabled="currentPage === 1" @click="prevPage">Précédent</button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage">Suivant</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Table from "@/components/ui/table/Table.vue";
import AdminSidebar from "@/domains/navigation/components/TheAdminSidebar.vue";
import { EditIcon, TrashIcon } from "lucide-vue-next";

// Définir une interface pour les utilisateurs
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const users = ref<User[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

// Pagination logic
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return users.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage));

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Charger la liste des utilisateurs depuis l'API
const loadUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiBaseUrl}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = response.data.map((user: any) => ({
      ...user,
      id: user.id || user.postgresId,
    }));
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs :", error);
  }
};

// Navigation vers la page d'ajout ou d'édition
const goToForm = (id?: string) => {
  if (id) {
    router.push({ name: "admin-edit-user", params: { id } });
  } else {
    router.push({ name: "admin-add-user" });
  }
};

// Suppression d'un utilisateur
const deleteUser = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${apiBaseUrl}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = users.value.filter((user) => user.id !== userId);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.admin-container {
  display: flex;
  width: 100%;
  overflow-x: hidden;
}

.admin-content {
  flex-grow: 1;
  padding: 20px;
  width: 100%;
}

.table-container {
  overflow-x: auto;
  width: 100%;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  margin: 0 10px;
}

table {
  min-width: 600px;
}
</style>
