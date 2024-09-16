<template>
    <div class="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <img :src="category.image" :alt="category.name" class="w-full h-48 object-cover" />
  
      <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <h2 class="text-white text-2xl font-bold">{{ category.name }}</h2>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  defineProps<{
    category: {
      name: string;
      image: string;
    };
  }>();
  </script>
  
  <style scoped>
  .relative {
    cursor: pointer;
  }
  </style>
  