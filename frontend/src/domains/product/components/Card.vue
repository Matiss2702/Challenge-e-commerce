<template>
  <div @click="handleClick" class="relative flex flex-col p-4 bg-white rounded-lg cursor-pointer">
    <img
      v-if="product.image"
      :src="product.image"
      :alt="product.name"
      class="object-cover w-full mb-4 rounded-md h-61"
      @click.stop="handleClick"
    />

    <div class="flex items-center justify-between">
      <h2 class="mb-2 text-lg font-semibold text-left">{{ product.name || "Nom du produit non disponible" }}</h2>
      <div v-if="product.isAgeRestricted && !isLoggedIn" class="ml-2 warning-icon">
        <AlertTriangle class="text-red-500" :size="20" />
        <div class="tooltip">Connectez-vous pour voir ce produit</div>
      </div>
    </div>

    <p class="mb-1 text-left text-gray-500">{{ product.category || "Catégorie non disponible" }}</p>
    <p class="font-bold text-left text-black">{{ product.price }}€</p>

    <div v-if="product.isAgeRestricted" class="absolute p-1 bg-black bg-opacity-50 rounded-full top-2 left-2">
      <Wine class="text-white" :size="20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { Wine, AlertTriangle } from "lucide-vue-next";

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
  (e: "select-product", id: number): void;
}>();

const handleClick = () => {
  emit("select-product", props.product.id);
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
