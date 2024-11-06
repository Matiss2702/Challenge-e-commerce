<template>
  <div class="admin-container">
    <AdminSidebar />
    <div class="admin-content p-4">
      <h1 class="text-2xl font-bold mb-4">Gestion des Produits</h1>
      <button class="bg-blue-500 text-white px-4 py-2 rounded mb-4" @click="goToForm()">
        Ajouter un Produit
      </button>

      <!-- Affichage du message de chargement -->
      <p v-if="loading" class="text-center text-gray-500">Chargement des produits...</p>

      <!-- Table des produits avec icônes -->
      <div class="table-container overflow-x-auto">
        <Table v-if="!loading && products.length">
          <TableCaption>Liste des produits</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="product in paginatedProducts" :key="product.postgresId">
              <TableCell>{{ product.name }}</TableCell>
              <TableCell>{{ product.price }} €</TableCell>
              <TableCell>{{ product.stock }}</TableCell>
              <TableCell>
                <button class="text-yellow-500 mr-2" @click="goToForm(product.postgresId)" aria-label="Modifier">
                  <EditIcon class="w-6 h-6" />
                </button>
                <button class="text-red-500" @click="deleteProduct(product.postgresId)" aria-label="Supprimer">
                  <TrashIcon class="w-6 h-6" />
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter v-if="paginatedProducts.length === 0">
            <TableRow>
              <TableCell colspan="4" class="text-center text-gray-500">Aucun produit trouvé.</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="pagination-controls">
        <button :disabled="currentPage === 1" @click="prevPage">Précédent</button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage">Suivant</button>
      </div>

      <!-- Message quand aucun produit n'est trouvé -->
      <p v-if="!loading && products.length === 0" class="text-center text-gray-500">Aucun produit trouvé.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Table from '@/components/ui/table/Table.vue';
import AdminSidebar from '@/domains/navigation/components/TheAdminSidebar.vue';

// Import des icônes de Lucide
import { EditIcon, TrashIcon } from 'lucide-vue-next';

interface Product {
  postgresId: string;
  name: string;
  price: number;
  stock: number;
}

const products = ref<Product[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

// Pagination logic
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return products.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Load products from the API
const loadProducts = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiBaseUrl}/api/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    products.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des produits :', error);
  } finally {
    loading.value = false;
  }
};

// Navigation to add/edit form
const goToForm = (id?: string) => {
  if (id) {
    router.push({ name: 'admin-edit-product', params: { id } });
  } else {
    router.push({ name: 'admin-add-product' });
  }
};

// Delete product method
const deleteProduct = async (productId: string) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiBaseUrl}/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      products.value = products.value.filter((product) => product.postgresId !== productId);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit :', error);
    }
  }
};

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.admin-container {
  display: flex;
  width: 100%;
  overflow-x: hidden;
}

.admin-content {
  flex-grow: 1;
  padding: 20px;
  width: 100%;
}

.table-container {
  overflow-x: auto;
  width: 100%;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  margin: 0 10px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

body {
  overflow-x: hidden;
}
</style>
