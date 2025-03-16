<template>
  <div class="flex max-w-full px-1 py-2 mx-auto">
    <!-- Sidebar avec filtres -->
    <TheSidebar
      :categories="categories"
      @filter-category="filterByCategory"
      @filter-price="filterByPrice"
      @filter-alcohol="filterByAlcohol"
      @filter-stock="filterByStock"
      @filter-search="filterBySearch"
    />

    <!-- Contenu principal de la page produit -->
    <div class="flex-grow px-2">
      <h1 class="mb-6 text-3xl font-bold">Tous nos Produits</h1>

      <!-- Message quand aucun produit n'est trouvé -->
      <div v-if="products.length === 0" class="py-4 text-center text-gray-600">Aucun résultat trouvé.</div>

      <!-- Grille des produits -->
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card
          v-for="product in products"
          :key="product.id"
          :product="product"
          :isLoggedIn="isLoggedIn"
          @select-product="goToProductDetail"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import TheSidebar from "@/domains/navigation/components/TheSidebar.vue";
import Card from "@/domains/product/components/Card.vue";

// Interface pour typer les produits
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAgeRestricted: boolean;
}

// Variables réactives
const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const isLoggedIn = ref(false);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

// Paramètres de filtres incluant la recherche
const filters = ref({
  category: [] as string[],
  maxPrice: 100,
  alcohol: "",
  stock: false,
  searchTerm: "",
});

// Charger les produits depuis l'API en appliquant les filtres
const loadProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    const params = {
      category: filters.value.category,
      maxPrice: filters.value.maxPrice,
      alcohol: filters.value.alcohol,
      inStock: filters.value.stock.toString(),
      searchTerm: filters.value.searchTerm,
    };

    const response = await axios.get(`${apiBaseUrl}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    const baseImageUrl = `${apiBaseUrl}/`;
    products.value = response.data.map((product: any) => ({
      id: product.postgresId,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.imagePath ? `${baseImageUrl}${product.imagePath}` : "path/to/default/image.jpg",
      isAgeRestricted: product.isAgeRestricted || false,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
  }
};

// Charger dynamiquement les catégories
const loadCategories = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/products/categories`);
    categories.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
};

// Méthodes de filtrage
const filterByCategory = (selectedCategories: string[]) => {
  filters.value.category = selectedCategories;
  loadProducts();
};

const filterByPrice = (price: number) => {
  filters.value.maxPrice = price;
  loadProducts();
};

const filterByAlcohol = (type: string) => {
  filters.value.alcohol = type;
  loadProducts();
};

const filterByStock = (inStock: boolean) => {
  filters.value.stock = inStock;
  loadProducts();
};

const filterBySearch = (search: string) => {
  filters.value.searchTerm = search;
  loadProducts();
};

// Redirection vers le détail d'un produit
const goToProductDetail = (productId: number) => {
  router.push({ name: "product-product-detail", params: { id: productId } });
};

onMounted(() => {
  loadProducts();
  loadCategories();
});
</script>
