<template>
  <div>
    <h1>Vérification de compte</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const message = ref<string>("Vérification en cours...");
const router = useRouter();

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/auth/verify-account?token=${token}`);
      message.value = response.data.message;

      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    } catch (error: any) {
      console.error("Erreur de vérification:", error);
      message.value = error.response?.data?.message || "Une erreur est survenue lors de la vérification";
    }
  } else {
    message.value = "Lien de vérification invalide";
  }
});
</script>

<style scoped>
h1 {
  color: #2c3e50;
}
p {
  font-size: 1.2rem;
}
</style>
