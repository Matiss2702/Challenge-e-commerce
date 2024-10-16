<template>
  <div class="admin-container">
    <AdminSidebar />

    <div class="admin-content p-4">
      <h1 class="text-2xl font-bold mb-4">Gestion des Utilisateurs</h1>

      <button
        class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        @click="goToForm()"
      >
        Ajouter un Utilisateur
      </button>

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
          <TableRow v-for="user in paginatedUsers" :key="user.postgresId">
            <TableCell>{{ user.name }}</TableCell>
            <TableCell>{{ user.email }}</TableCell>
            <TableCell>{{ user.role }}</TableCell>
            <TableCell>
              <button
                class="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                @click="goToForm(user.postgresId)"
              >
                Modifier
              </button>
              <button
                class="bg-red-500 text-white px-2 py-1 rounded"
                @click="deleteUser(user.postgresId)"
              >
                Supprimer
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter v-if="paginatedUsers.length === 0">
          <TableRow>
            <TableCell colspan="4" class="text-center text-gray-500">Aucun utilisateur trouvé.</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Table from '@/components/ui/table/Table.vue';
import AdminSidebar from '@/domains/navigation/components/TheAdminSidebar.vue';

interface User {
  postgresId: string;
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

// Load users from the API
const loadUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiBaseUrl}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    users.value = response.data.map((user: any) => ({
      ...user,
      postgresId: user.postgresId || user.id,
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs :', error);
  }
};

// Navigation to add/edit form
const goToForm = (id?: string) => {
  if (id) {
    router.push({ name: 'admin-edit-user', params: { id } });
  } else {
    router.push({ name: 'admin-add-user' });
  }
};

// Delete user method
const deleteUser = async (userId: string) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${apiBaseUrl}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = users.value.filter((user) => user.postgresId !== userId);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.admin-container {
  display: flex;
}

.admin-content {
  flex-grow: 1;
  padding: 20px;
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
</style>
