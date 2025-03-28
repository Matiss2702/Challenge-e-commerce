<template>
  <div class="profile-container">
    <h1>Profile</h1>
    <div v-if="user">
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label for="name">Nom</label>
          <input type="text" id="name" v-model="userData.name" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="userData.email" required />
        </div>

        <!-- Changer le mot de passe: label et checkbox sur la même ligne -->
        <div class="form-group-checkbox">
          <label for="changePassword" class="label-inline">Changer le mot de passe</label>
          <input type="checkbox" id="changePassword" v-model="isPasswordChangeEnabled" />
        </div>

        <!-- Si changement de mot de passe activé, afficher les inputs du mot de passe -->
        <div v-if="isPasswordChangeEnabled">
          <div class="form-group">
            <label for="currentPassword">Ancien mot de passe</label>
            <input type="password" id="currentPassword" v-model="userData.currentPassword" required />
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
          </div>
          <div class="form-group">
            <label for="newPassword">Nouveau mot de passe</label>
            <input type="password" id="newPassword" v-model="userData.newPassword" required />
          </div>
        </div>

        <!-- Inverser les boutons avec espacement -->
        <button @click="handleLogout" class="btn-secondary">Déconnexion</button>
        <button type="submit" class="btn-primary">Mettre à jour</button>
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
/* Styles généraux */
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

/* Styles pour les champs de formulaire (inputs en colonne) */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
}

/* Styles pour la checkbox et le label sur la même ligne */
.form-group-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.label-inline {
  flex-grow: 0;
  margin-right: 5px;
  text-align: left;
}

input[type="checkbox"] {
  margin-left: 5px;
  width: auto;
  height: 20px;
  cursor: pointer;
}

/* Espacement supplémentaire entre les boutons */
button {
  padding: 10px 20px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
}

button:hover {
  background-color: #e68a00;
}

.btn-primary {
  background-color: #ff9800;
  margin-left: 20px;
}

.btn-secondary {
  background-color: #f44336;
}

button:focus,
input:focus {
  outline: none;
  border: 2px solid #ff9800;
}

.error-message {
  color: #f44336;
  background-color: #fdd;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.success-message {
  color: #4caf50;
  background-color: #ddf;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>
