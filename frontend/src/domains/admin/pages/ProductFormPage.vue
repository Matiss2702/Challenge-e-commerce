<template>
  <div class="admin-container">
    <AdminSidebar />
    <div class="admin-content p-4">
      <h1>{{ isEditMode ? 'Modifier Produit' : 'Ajouter Produit' }}</h1>
      <!-- Utilisation du composant ProductForm -->
      <ProductForm 
        :product="product" 
        :isEditMode="isEditMode" 
        @submit="handleProductFormSubmit" 
        @cancel="goBack" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import AdminSidebar from '@/domains/navigation/components/TheAdminSidebar.vue';
import ProductForm from '@/domains/admin/components/ProductForm.vue';

// Définition de l'interface Product
interface Product {
  postgresId?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imagePath?: string;
}

// Initialisation des données
const product = ref<Product | null>(null);
const isEditMode = ref(false);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();

// Charger les données si on est en mode édition
onMounted(async () => {
  const id = route.params.id;

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

// Gestion de la soumission du formulaire
const handleProductFormSubmit = async (formData: FormData) => {
  const token = localStorage.getItem('token');
  const productId = route.params.id;

  try {
    if (isEditMode.value && productId) {
      // Mise à jour du produit
      await axios.put(`${apiBaseUrl}/api/products/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
    } else {
      // Création d'un nouveau produit
      await axios.post(`${apiBaseUrl}/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
    }
    // Rediriger vers la liste des produits
    router.push('/admin/products');
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error);
  }
};

// Gestion de l'annulation
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
