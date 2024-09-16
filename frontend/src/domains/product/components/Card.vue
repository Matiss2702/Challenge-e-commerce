<template>
  <div @click="handleClick" class="bg-white rounded-lg p-4 flex flex-col cursor-pointer">
    <img :src="product.image" :alt="product.name" class="rounded-md mb-4 object-cover w-full h-48" />
    <h2 class="text-lg text-left font-semibold mb-2">{{ product.name }}</h2>
    <p class="text-gray-500 mb-1 text-left">{{ product.category }}</p>
    <p class="text-black font-bold text-left">{{ product.price }}€</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  product: {
    id: number;
    name: string;
    image: string;
    category: string;
    price: number;
  };
}>();

const emit = defineEmits<{
  (e: 'select-product', id: number): void;
}>();

const handleClick = () => {
  emit('select-product', props.product.id);
};
</script>

<style scoped></style>
