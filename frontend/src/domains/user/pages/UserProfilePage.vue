<template>
  <div class="profile-container">
    <h1 class="title">Mon Profil</h1>

    <div v-if="user">
      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label for="name">Nom</label>
          <input type="text" id="name" v-model="userData.name" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="userData.email" required />
        </div>

        <div class="form-group-checkbox">
          <label for="changePassword" class="label-inline">Changer le mot de passe</label>
          <input type="checkbox" id="changePassword" v-model="isPasswordChangeEnabled" />
        </div>

        <div v-if="isPasswordChangeEnabled">
          <div class="form-group">
            <label for="currentPassword">Ancien mot de passe</label>
            <input type="password" id="currentPassword" v-model="userData.currentPassword" required />
          </div>

          <div class="form-group">
            <label for="newPassword">Nouveau mot de passe</label>
            <input type="password" id="newPassword" v-model="userData.newPassword" required />
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <div class="button-group">
          <button type="submit" class="btn-primary">Mettre à jour</button>
          <button type="button" class="btn-secondary" @click="handleLogout">Déconnexion</button>
        </div>

        <button type="button" class="btn-link" @click="goToOrderHistory">Voir l'historique de mes commandes</button>
      </form>
    </div>

    <div v-else>
      <p>Chargement des informations...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import axios from "axios";
import { toast } from "@/components/ui/toast/use-toast";

const authStore = useAuthStore();
const router = useRouter();
const user = ref(authStore.user);
const isPasswordChangeEnabled = ref(false);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

interface UserProfile {
  name: string;
  birthdate: string;
  email: string;
  postgresId: string;
  currentPassword?: string;
  newPassword?: string;
}

const userData = ref<UserProfile>({
  name: "",
  birthdate: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  postgresId: "",
});

const goToOrderHistory = () => {
  router.push("/my-orders");
};

onMounted(async () => {
  if (!user.value) {
    try {
      await authStore.fetchUser();
      user.value = authStore.user;
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur:", error);
    }
  }
  if (user.value) {
    userData.value = {
      name: user.value.name,
      birthdate: new Date(user.value.birthdate).toISOString().split("T")[0],
      email: user.value.email,
      postgresId: user.value.postgresId,
      currentPassword: "",
      newPassword: "",
    };
  }
});

const updateProfile = async () => {
  try {
    if (!user.value || !userData.value.postgresId) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations de l'utilisateur.",
        variant: "destructive",
      });
      return;
    }

    const payload: UserProfile = { ...userData.value };

    if (isPasswordChangeEnabled.value) {
      if (!payload.currentPassword || !payload.newPassword) {
        toast({
          title: "Champs manquants",
          description: "Veuillez remplir les deux champs pour changer le mot de passe.",
          variant: "destructive",
        });
        return;
      }
    } else {
      delete payload.currentPassword;
      delete payload.newPassword;
    }

    const token = authStore.token;

    if (!token) {
      toast({
        title: "Non authentifié",
        description: "Vous devez être connecté pour effectuer cette action.",
        variant: "destructive",
      });
      return;
    }

    await axios.put(`${apiBaseUrl}/api/users/profile/${userData.value.postgresId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast({
      title: "Profil mis à jour",
      description: "Votre profil a été mis à jour avec succès.",
      variant: "default",
    });

    await authStore.fetchUser();
  } catch (err: any) {
    toast({
      title: "Erreur",
      description: err.response?.data?.message || "Erreur lors de la mise à jour du profil.",
      variant: "destructive",
    });
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fffdfa;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #333;
}

.profile-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.form-group-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.label-inline {
  margin-right: 10px;
  font-weight: 500;
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  background-color: #ff9800;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #e68a00;
}

.btn-secondary {
  background-color: #f44336;
  color: white;
  border: none;
}

.btn-secondary:hover {
  background-color: #d32f2f;
}

.btn-link {
  margin-top: 15px;
  background: none;
  border: none;
  color: #ff9800;
  text-decoration: underline;
  cursor: pointer;
  font-weight: bold;
  align-self: flex-start;
}

.btn-link:hover {
  color: #e68a00;
}

.error-message {
  color: #f44336;
  background-color: #fdd;
  padding: 10px;
  border-radius: 5px;
  margin-top: -10px;
  margin-bottom: 10px;
}

.success-message {
  color: #4caf50;
  background-color: #ddf;
  padding: 10px;
  border-radius: 5px;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
