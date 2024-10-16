<template>
  <div @click="handleClick" class="bg-white rounded-lg p-4 flex flex-col cursor-pointer relative">
    <!-- Image du produit avec redirection au clic -->
    <img v-if="product.image" :src="product.image" :alt="product.name" class="rounded-md mb-4 object-cover w-full h-61" @click.stop="handleClick" />

    <!-- Nom et détails du produit -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg text-left font-semibold mb-2">{{ product.name || 'Nom du produit non disponible' }}</h2>
      <!-- Icône d'avertissement à droite du titre si le produit est restreint et l'utilisateur n'est pas connecté -->
      <div v-if="product.isAgeRestricted && !isLoggedIn" class="warning-icon ml-2">
        <AlertTriangle class="text-red-500" :size="20" />
        <div class="tooltip">Connectez-vous pour voir ce produit</div>
      </div>
    </div>

    <p class="text-gray-500 mb-1 text-left">{{ product.category || 'Catégorie non disponible' }}</p>
    <p class="text-black font-bold text-left">{{ product.price }}€</p>

    <!-- Icône pour produits alcoolisés (age restricted) -->
    <div v-if="product.isAgeRestricted" class="absolute top-2 left-2 bg-black bg-opacity-50 rounded-full p-1">
      <Wine class="text-white" :size="20" />
    </div>
  </div>
</template>


<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Wine, AlertTriangle } from 'lucide-vue-next';

const props = defineProps<{
  product: {
    id: number;
    name: string;
    image: string;
    category: string;
    price: number;
    isAgeRestricted: boolean;
  };
  isLoggedIn: boolean;
}>();

const emit = defineEmits<{
  (e: 'select-product', id: number): void;
}>();

const handleClick = () => {
  emit('select-product', props.product.id);
};
</script>

<style scoped>
.warning-icon {
  position: relative;
}

.tooltip {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 1;
}

.warning-icon:hover .tooltip {
  display: block;
}

</style>
