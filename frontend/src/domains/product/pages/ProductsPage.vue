<template>
  <div class="flex max-w-full mx-auto py-2 px-1">
    <!-- Sidebar avec filtres -->
    <TheSidebar 
      :categories="categories" 
      @filter-category="filterByCategory" 
      @filter-price="filterByPrice"
      @filter-alcohol="filterByAlcohol"
      @filter-stock="filterByStock"
    />

    <!-- Contenu principal de la page produit -->
    <div class="flex-grow px-2">
      <h1 class="text-3xl font-bold mb-6">Tous nos Produits</h1>

      <!-- Grille des produits -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Boucle pour afficher les cartes de produits -->
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import TheSidebar from '@/domains/navigation/components/TheSidebar.vue';
import Card from '@/domains/product/components/Card.vue';

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

// Variables et constantes
const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const isLoggedIn = ref(false);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

// Paramètres de filtres
const filters = ref({
  category: [] as string[],
  maxPrice: 100,
  alcohol: '',
  stock: false
});

// Charger les produits avec filtres
const loadProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    const params = {
      category: filters.value.category,
      maxPrice: filters.value.maxPrice,
      alcohol: filters.value.alcohol,
      inStock: filters.value.stock.toString(),
    };

    const response = await axios.get(`${apiBaseUrl}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });

    const baseImageUrl = `${apiBaseUrl}/`;
    
    products.value = response.data.map((product: any) => ({
      id: product.postgresId,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.imagePath ? `${baseImageUrl}${product.imagePath}` : 'path/to/default/image.jpg',
      isAgeRestricted: product.isAgeRestricted || false,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
  }
};

// Charger les catégories dynamiques
const loadCategories = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/products/categories`);
    categories.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
  }
};

// Filtrer par catégories multiples
const filterByCategory = (selectedCategories: string[]) => {
  filters.value.category = selectedCategories;
  loadProducts();
};

// Filtrer par prix
const filterByPrice = (price: number) => {
  filters.value.maxPrice = price;
  loadProducts();
};

// Filtrer par produits alcoolisés
const filterByAlcohol = (type: string) => {
  filters.value.alcohol = type;
  loadProducts();
};

// Filtrer par stock
const filterByStock = (inStock: boolean) => {
  filters.value.stock = inStock;
  loadProducts();
};

// Redirection vers les détails du produit
const goToProductDetail = (productId: number) => {
  router.push({ name: 'product-product-detail', params: { id: productId } });
};

onMounted(() => {
  loadProducts();
  loadCategories();
});
</script>



<style scoped>
.admin-container {
  display: flex;
}

.admin-content {
  flex-grow: 1;
  padding: 20px;
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-danger {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
}
</style>
