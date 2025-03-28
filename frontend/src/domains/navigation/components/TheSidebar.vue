<template>
  <aside class="w-64 h-full p-4 bg-white shadow-lg">
    <!-- Barre de recherche -->
    <div class="mb-4">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Rechercher un produit..."
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        @input="$emit('filter-search', searchTerm)"
      />
    </div>

    <Accordion type="single" collapsible>
      <!-- Catégories -->
      <AccordionItem value="categories">
        <AccordionTrigger>Catégories</AccordionTrigger>
        <AccordionContent>
          <ul>
            <li v-for="category in filteredCategories" :key="category">
              <a
                href="#"
                class="text-gray-700 transition-colors duration-200 hover:text-blue-500"
                :class="{ 'font-bold text-blue-600': selectedCategories.includes(category) }"
                @click.prevent="toggleCategory(category)"
              >
                {{ category }}
              </a>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <!-- Filtrer par Prix -->
      <AccordionItem value="filter-by-price">
        <AccordionTrigger>Filtrer par Prix</AccordionTrigger>
        <AccordionContent>
          <div class="flex items-center">
            <span class="mr-2">0€</span>
            <input
              type="range"
              class="w-full mt-2 accent-blue-500"
              min="0"
              max="100"
              v-model="currentPrice"
              @input="emit('filter-price', currentPrice)"
            />
            <span class="ml-2">{{ currentPrice }}€</span>
          </div>
        </AccordionContent>
      </AccordionItem>

      <!-- Produits Alcoolisés -->
      <AccordionItem value="alcohol-products">
        <AccordionTrigger>Produits Alcoolisés</AccordionTrigger>
        <AccordionContent>
          <div class="flex items-center mb-2">
            <input type="radio" name="alcohol" id="avec-alcool" class="mr-2" @change="emit('filter-alcohol', 'with')" />
            <label for="avec-alcool" class="text-gray-700">Avec Alcool</label>
          </div>
          <div class="flex items-center">
            <input
              type="radio"
              name="alcohol"
              id="sans-alcool"
              class="mr-2"
              @change="emit('filter-alcohol', 'without')"
            />
            <label for="sans-alcool" class="text-gray-700">Sans Alcool</label>
          </div>
        </AccordionContent>
      </AccordionItem>

      <!-- En Stock -->
      <AccordionItem value="in-stock">
        <AccordionTrigger>En Stock</AccordionTrigger>
        <AccordionContent>
          <div class="flex items-center">
            <input
              type="checkbox"
              id="en-stock"
              class="mr-2"
              @change="emit('filter-stock', ($event.target as HTMLInputElement).checked)"
            />
            <label for="en-stock" class="text-gray-700">En Stock</label>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const props = defineProps<{ categories: string[] }>();
const emit = defineEmits(["filter-category", "filter-price", "filter-alcohol", "filter-stock", "filter-search"]);

const searchTerm = ref("");
const currentPrice = ref(100);
const selectedCategories = ref<string[]>([]);

const filteredCategories = computed(() => {
  return props.categories.filter((category) => category.toLowerCase().includes(searchTerm.value.toLowerCase()));
});

const toggleCategory = (category: string) => {
  const index = selectedCategories.value.indexOf(category);
  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  } else {
    selectedCategories.value.push(category);
  }
  emit("filter-category", [...selectedCategories.value]);
};
</script>

<style scoped>
aside {
  width: 16rem;
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: #ddd;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

input[type="range"]:hover {
  opacity: 1;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  cursor: pointer;
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  cursor: pointer;
  border-radius: 50%;
}
</style>
