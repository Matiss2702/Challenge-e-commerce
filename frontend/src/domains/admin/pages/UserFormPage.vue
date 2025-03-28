<template>
  <div class="admin-container">
    <AdminSidebar />
    <div class="p-4 admin-content">
      <h1>{{ isEditMode ? "Modifier Utilisateur" : "Ajouter Utilisateur" }}</h1>
      <UserForm v-if="user" :user="user" :isEditMode="isEditMode" @submit="handleUserFormSubmit" @cancel="goBack" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import UserForm from "@/domains/admin/components/UserForm.vue";
import AdminSidebar from "@/domains/navigation/components/TheAdminSidebar.vue";
import { toast } from "@/components/ui/toast/use-toast";

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
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiBaseUrl}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        user.value = response.data.postgresData;
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'utilisateur.",
        variant: "destructive",
      });
    }
  } else {
    isEditMode.value = false;
    user.value = {
      id: 0,
      name: "",
      email: "",
      birthdate: "",
      role: "ROLE_USER",
    };
  }
});

const handleUserFormSubmit = async (userData: User) => {
  const token = localStorage.getItem("token");
  try {
    if (isEditMode.value) {
      await axios.put(`${apiBaseUrl}/api/users/${userData.id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Utilisateur modifié",
        description: "Les informations ont été mises à jour avec succès.",
        variant: "default",
      });
    } else {
      await axios.post(`${apiBaseUrl}/api/users`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Utilisateur ajouté",
        description: "L'utilisateur a été créé avec succès.",
        variant: "default",
      });
    }
    router.push("/admin/users");
  } catch (error: any) {
    console.error("Erreur lors de la sauvegarde :", error);
    toast({
      title: "Erreur",
      description: error.response?.data?.message || "Une erreur s'est produite.",
      variant: "destructive",
    });
  }
};

const goBack = () => {
  router.push("/admin/users");
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
