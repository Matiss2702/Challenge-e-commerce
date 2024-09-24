<template>
  <div class="admin-container">
    <AdminSidebar />
    <div class="admin-content p-4">
      <h1 class="text-2xl font-bold mb-4">Gestion des Produits</h1>
      <button class="bg-blue-500 text-white px-4 py-2 rounded mb-4" @click="goToForm()">
        Ajouter un Produit
      </button>
      <Table>
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
          <TableRow v-for="product in products" :key="product.postgresId">
            <TableCell>{{ product.name }}</TableCell>
            <TableCell>{{ product.price }} €</TableCell>
            <TableCell>{{ product.stock }}</TableCell>
            <TableCell>
              <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-2" @click="goToForm(product.postgresId)">
                Modifier
              </button>
              <button class="bg-red-500 text-white px-2 py-1 rounded" @click="deleteProduct(product.postgresId)">
                Supprimer
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter v-if="products.length === 0">
          <TableRow>
            <TableCell colspan="4" class="text-center text-gray-500">Aucun produit trouvé.</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Table from '@/components/ui/table/Table.vue';
import AdminSidebar from '@/domains/navigation/components/TheAdminSidebar.vue';

interface Product {
  postgresId: string;
  name: string;
  price: number;
  stock: number;
}

const products = ref<Product[]>([]);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

const loadProducts = async () => {
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
  }
};

const goToForm = (id?: string) => {
  if (id) {
    console.log('Redirecting to edit product with ID:', id);
    router.push({ name: 'admin-edit-product', params: { id } });
  } else {
    router.push({ name: 'admin-add-product' });
  }
};


const deleteProduct = async (productId: string) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${apiBaseUrl}/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    products.value = products.value.filter(product => product.postgresId !== productId);
  } catch (error) {
    console.error('Erreur lors de la suppression du produit :', error);
  }
};

onMounted(() => {
  loadProducts();
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
</style>
