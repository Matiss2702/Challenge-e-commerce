<template>
  <div class="p-4 bg-white rounded shadow-md">
    <form @submit.prevent="submitForm">
      <div class="mb-2">
        <label for="name">Nom</label>
        <input type="text" v-model="form.name" id="name" class="w-full px-2 py-1 border rounded" />
        <p v-if="errors.name" class="text-red-500">{{ errors.name }}</p>
      </div>

      <div class="mb-2">
        <label for="email">Email</label>
        <input type="email" v-model="form.email" id="email" class="w-full px-2 py-1 border rounded" />
        <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
      </div>

      <div class="mb-2">
        <label for="birthdate">Date de Naissance</label>
        <input type="date" v-model="form.birthdate" id="birthdate" class="w-full px-2 py-1 border rounded" />
        <p v-if="errors.birthdate" class="text-red-500">{{ errors.birthdate }}</p>
      </div>

      <div v-if="!isEditMode" class="mb-2">
        <label for="password">Mot de passe</label>
        <input type="password" v-model="form.password" id="password" class="w-full px-2 py-1 border rounded" />
        <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
      </div>

      <div v-if="isEditMode" class="mb-2">
        <input type="checkbox" id="passwordReset" v-model="form.passwordReset" />
        <label for="passwordReset">Envoyer un email pour réinitialiser le mot de passe</label>
      </div>

      <div class="mb-2">
        <label for="role">Rôle</label>
        <select v-model="form.role" id="role" class="w-full px-2 py-1 border rounded">
          <option value="ROLE_USER">Utilisateur</option>
          <option value="ROLE_STORE_KEEPER">Magazinier</option>
          <option value="ROLE_ADMIN">Administrateur</option>
        </select>
        <p v-if="errors.role" class="text-red-500">{{ errors.role }}</p>
      </div>

      <button type="submit" class="px-4 py-2 text-white bg-green-500 rounded">Sauvegarder</button>
      <button type="button" @click="$emit('cancel')" class="px-4 py-2 ml-2 text-black bg-gray-300 rounded">
        Annuler
      </button>
    </form>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useUserForm } from "@/domains/admin/composables/useUserForm";
import axios from "axios";
import { toast } from "@/components/ui/toast/use-toast";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const props = defineProps({
  user: Object,
  isEditMode: Boolean,
});
const emit = defineEmits(["submit", "cancel"]);

const { form, errors, validateForm } = useUserForm(props);

const submitForm = async () => {
  if (validateForm()) {
    if (form.value.passwordReset && props.isEditMode) {
      try {
        await axios.post(`${apiBaseUrl}/api/auth/request-reset`, {
          email: form.value.email,
        });
        toast({
          title: "Lien envoyé",
          description: `Le lien de réinitialisation a été envoyé à ${form.value.email}.`,
          variant: "default",
        });
      } catch (err) {
        toast({
          title: "Erreur",
          description: err.response?.data?.message || "Impossible d'envoyer l'email de réinitialisation.",
          variant: "destructive",
        });
      }
    }

    emit("submit", { ...form.value });
  }
};
</script>
