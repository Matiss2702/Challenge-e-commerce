<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

import categoryHealthy from '@/assets/categorie-healty.svg';
import categoryAlcool from '@/assets/categorie-alcool.svg';
import categorySansAlcool from '@/assets/categorie-sans-alcool.svg';
import categoryBouteille from '@/assets/categorie-bouteille.svg';
import categoryJus from '@/assets/categorie-jus.svg';
import categoryCannette from '@/assets/categorie-canette.svg';

const categories = ref([
  {
    name: 'Healthy',
    image: categoryHealthy,
  },
  {
    name: 'Alcool',
    image: categoryAlcool,
  },
  {
    name: 'Sans Alcool',
    image: categorySansAlcool,
  },
  {
    name: 'Bouteille',
    image: categoryBouteille,
  },
  {
    name: 'Jus',
    image: categoryJus,
  },
  {
    name: 'Cannette',
    image: categoryCannette,
  },
]);
</script>
