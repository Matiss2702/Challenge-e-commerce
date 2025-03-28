<template>
  <form @submit.prevent="handleResetRequest" class="max-w-md mx-auto">
    <h2 class="mb-4 text-xl">Réinitialiser le mot de passe</h2>
    <input type="email" v-model="email" placeholder="Votre email" required class="w-full p-2 mb-2 border rounded" />
    <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded">Envoyer le lien de réinitialisation</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { toast } from "@/components/ui/toast/use-toast";

const email = ref("");
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const handleResetRequest = async () => {
  try {
    await axios.post(`${apiBaseUrl}/api/auth/request-reset`, { email: email.value });
    toast({
      title: "Lien envoyé",
      description: "Consultez votre boîte mail pour réinitialiser votre mot de passe.",
      variant: "default",
    });
  } catch (err: any) {
    toast({
      title: "Erreur",
      description: err.response?.data?.message || "Impossible d'envoyer le lien.",
      variant: "destructive",
    });
  }
};
</script>
