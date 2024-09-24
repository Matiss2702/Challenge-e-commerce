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
          <TableRow v-for="user in users" :key="user.postgresId">
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
        <TableFooter v-if="users.length === 0">
          <TableRow>
            <TableCell colspan="4" class="text-center text-gray-500">Aucun utilisateur trouvé.</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

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

const goToForm = (id?: string) => {
  if (id) {
    console.log(`Navigating to edit user with postgresId: ${id}`);
    router.push({ name: 'admin-edit-user', params: { id } });
  } else {
    console.log('Navigating to add new user');
    router.push({ name: 'admin-add-user' });
  }
};


const deleteUser = async (userId: string) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${apiBaseUrl}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = users.value.filter(user => user.postgresId !== userId);
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
</style>
