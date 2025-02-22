<template>
  <div class="max-w-4xl px-4 py-8 mx-auto text-center">
    <h1 class="mb-4 text-3xl font-bold">Paiement Annulé</h1>
    <p class="mb-6 text-gray-700">Votre paiement a été annulé. Vous pouvez continuer vos achats.</p>
    <button @click="goToProducts" class="px-4 py-2 font-bold text-black bg-yellow-500 rounded hover:bg-yellow-600">
      Retour aux Produits
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();
const router = useRouter();

const goToProducts = () => {
  router.push({ name: "product-product-list" });
};
</script>

<style scoped>
/* Ajoutez des styles si nécessaire */
</style>
