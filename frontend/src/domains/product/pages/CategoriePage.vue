<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <!-- Boucle pour afficher les cartes de catégories -->
      <CategoryCard
        v-for="category in categories"
        :key="category.name"
        :category="category"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import CategoryCard from '@/domains/product/components/CategoryCard.vue';
  
  // Liste des catégories - Données brutes pour le moment
  const categories = ref([
    {
      name: 'Healthy',
      image: '@/assets/healthy-category.jpg',
    },
    {
      name: 'Alcool',
      image: '@/assets/alcool-category.jpg',
    },
    {
      name: 'Sans Alcool',
      image: '@/assets/sans-alcool-category.jpg',
    },
    {
      name: 'Bouteille',
      image: '@/assets/bouteille-category.jpg',
    },
    {
      name: 'Jus',
      image: '@/assets/jus-category.jpg',
    },
    {
      name: 'Cannette',
      image: '@/assets/cannette-category.jpg',
    },
  ]);
  </script>
  