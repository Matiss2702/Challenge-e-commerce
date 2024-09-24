<template>
  <div class="admin-container">
    <AdminSidebar />
    <div class="admin-content p-4">
      <h1>{{ isEditMode ? 'Modifier Utilisateur' : 'Ajouter Utilisateur' }}</h1>
      <UserForm v-if="user" :user="user" :isEditMode="isEditMode" @submit="handleUserFormSubmit" @cancel="goBack" />
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import UserForm from '@/domains/admin/components/UserForm.vue';
import AdminSidebar from '@/domains/navigation/components/TheAdminSidebar.vue';

interface User {
  id: number;
  name: string;
  email: string;
  birthdate: string;
  role: string;
}

const route = useRoute();
const router = useRouter();
const user = ref<User | null>(null);
const isEditMode = ref(false);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
  const id = route.params.id;

  if (id) {
    isEditMode.value = true;
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`${apiBaseUrl}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        user.value = response.data.postgresData;
        console.log('User data loaded:', user.value);
      } else {
        console.error('No user data found for this ID.');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  } else {
    isEditMode.value = false;
    user.value = {
      id: 0,
      name: '',
      email: '',
      birthdate: '',
      role: 'ROLE_USER',
    };
  }
});

const handleUserFormSubmit = async (userData: User) => {
  const token = localStorage.getItem('token');
  try {
    if (isEditMode.value) {
      await axios.put(`${apiBaseUrl}/api/users/${userData.id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      await axios.post(`${apiBaseUrl}/api/users`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    console.log('Form submitted successfully!');
    router.push('/admin/users');
  } catch (error) {
    console.error('Error submitting the form:', error);
  }
};

const goBack = () => {
  router.push('/admin/users');
};
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
