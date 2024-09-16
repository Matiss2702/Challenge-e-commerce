<template>
  <div class="flex max-w-full mx-auto py-2 px-1">
    <!-- Sidebar -->
    <TheSidebar class="w-56 mr-2" />

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
          @select-product="goToProductDetail"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TheSidebar from '@/domains/navigation/components/TheSidebar.vue';
import Card from '@/domains/product/components/Card.vue';

const router = useRouter();

// Import des images
import productMyrtille from '@/assets/produit-myrtille.svg';
import productFraise from '@/assets/produit-fraise.svg';
import productKiwi from '@/assets/produit-kiwi.svg';

// Liste des produits - Données brutes pour le moment
const products = ref([
  {
    id: 1,
    name: 'Jus de Myrtille',
    image: productMyrtille,
    category: 'Bouteilles',
    price: 4.5,
  },
  {
    id: 2,
    name: 'Jus de Fraise',
    image: productFraise,
    category: 'Bouteilles',
    price: 4.5,
  },
  {
    id: 3,
    name: 'Jus de Kiwi',
    image: productKiwi,
    category: 'Bouteilles',
    price: 4.5,
  },
  {
    id: 4,
    name: 'Jus de Kiwi',
    image: productKiwi,
    category: 'Bouteilles',
    price: 4.5,
  },
]);

// Fonction pour rediriger vers la page de détail du produit
const goToProductDetail = (productId: number) => {
  router.push({ name: 'product-product-detail', params: { id: productId } }); // Assurez-vous que ce nom est correct
};
</script>

<style scoped>
/* Ajuste la largeur de la sidebar */
.w-56 {
  width: 14rem;
}

/* Réduit l'espacement autour de la page */
.mx-auto {
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
}

/* Ajuste la taille et l'espacement des cartes de produits */
.grid {
  gap: 1rem;
}

.flex-grow {
  padding-left: 0.5rem;
}
</style>
