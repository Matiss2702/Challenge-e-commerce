<template>
  <div class="admin-container">
    <AdminSidebar />
    <div class="admin-content p-4">
      <h1>{{ isEditMode ? 'Modifier Produit' : 'Ajouter Produit' }}</h1>
      <ProductForm :product="product" :isEditMode="isEditMode" @submit="handleProductFormSubmit" @cancel="goBack" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import ProductForm from '@/domains/admin/components/ProductForm.vue';
import AdminSidebar from '@/domains/navigation/components/TheAdminSidebar.vue';

interface Product {
  postgresId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imagePath: string;
}

const route = useRoute();
const router = useRouter();
const product = ref<Product | null>(null);
const isEditMode = ref(false);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
  const id = route.params.id;

  const productId = route.params.id;
  console.log('Product ID from route:', productId);

  if (id) {
    isEditMode.value = true;
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`${apiBaseUrl}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        product.value = response.data;
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit :', error);
    }
  }
});


const handleProductFormSubmit = async (productData: Product) => {
  const token = localStorage.getItem('token');
  const productId = route.params.id;
  console.log('Product ID from route:', productId);

  try {
    if (isEditMode.value && productId) {
      await axios.put(`${apiBaseUrl}/api/products/${productId}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      await axios.post(`${apiBaseUrl}/api/products`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    router.push('/admin/products');
  } catch (error) {
    console.error('Erreur lors de l\'envoi du formulaire :', error);
  }
};

const goBack = () => {
  router.push('/admin/products');
};
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
