<template>
  <form @submit.prevent="handleReset" class="max-w-md mx-auto">
    <h2 class="mb-4 text-xl">Nouveau mot de passe</h2>
    <input
      type="password"
      v-model="password"
      placeholder="Nouveau mot de passe"
      required
      class="w-full p-2 mb-2 border rounded"
    />
    <input
      type="password"
      v-model="confirmPassword"
      placeholder="Confirmer le mot de passe"
      required
      class="w-full p-2 mb-4 border rounded"
    />
    <button type="submit" class="px-4 py-2 text-white bg-green-500 rounded">Réinitialiser</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "@/components/ui/toast/use-toast";

const route = useRoute();
const router = useRouter();

const token = route.query.token as string;
const password = ref("");
const confirmPassword = ref("");
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const handleReset = async () => {
  if (password.value !== confirmPassword.value) {
    toast({
      title: "Erreur",
      description: "Les mots de passe ne correspondent pas.",
      variant: "destructive",
    });
    return;
  }

  try {
    await axios.post(`${apiBaseUrl}/api/auth/reset-password`, {
      token,
      password: password.value,
    });

    toast({
      title: "Succès",
      description: "Mot de passe mis à jour. Vous pouvez maintenant vous connecter.",
      variant: "default",
    });

    router.push("/auth");
  } catch (err: any) {
    toast({
      title: "Erreur",
      description: err.response?.data?.message || "Échec de la réinitialisation.",
      variant: "destructive",
    });
  }
};
</script>
