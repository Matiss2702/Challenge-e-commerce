<template>
  <div class="max-w-4xl px-4 py-8 mx-auto">
    <h1 class="mb-6 text-3xl font-bold">Votre Panier</h1>

    <div v-if="cartItems.length === 0" class="text-center text-gray-600">Votre panier est vide.</div>

    <div v-else>
      <div v-for="item in cartItems" :key="item.id" class="flex items-center justify-between py-4 border-b">
        <div class="flex items-center">
          <img :src="item.image" :alt="item.name" class="object-cover w-20 h-20 mr-4 rounded-md" />
          <div>
            <h2 class="text-lg font-semibold">{{ item.name }}</h2>
            <p class="text-gray-500">{{ item.category }}</p>
            <p>{{ item.price }} € x {{ item.quantity }}</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-6">
        <button @click="clearCart" class="px-4 py-2 text-black bg-yellow-500 rounded hover:bg-yellow-600">
          Vider le Panier
        </button>
        <p class="text-xl font-bold">Total: {{ calculateTotal() }} €</p>
      </div>

      <div class="mt-6">
        <PaymentButton />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useCartStore } from "@/stores/cartStore";
import PaymentButton from "@/domains/product/components/PaymentButton.vue";
const cartStore = useCartStore();

const cartItems = cartStore.cartItems;
const clearCart = () => cartStore.clearCart();
const calculateTotal = () => cartStore.calculateTotal();
</script>
