<template>
  <div v-if="product" class="max-w-4xl mx-auto py-8 px-4">
    <!-- Affichage de l'image du produit -->
    <div class="flex flex-col md:flex-row items-center md:items-start">
      <img :src="product.image" :alt="product.name" class="w-full md:w-1/2 rounded-lg mb-4 md:mb-0 md:mr-8 object-cover" />

      <!-- Détails du produit -->
      <div class="flex-grow">
        <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>
        <p class="text-gray-700 mb-2">{{ product.category }}</p>
        <p class="text-green-600 mb-2">{{ product.description }}</p>
        <p class="text-gray-500 mb-2">{{ product.price }} €</p>
        <div class="flex items-center mb-2">
          <span class="text-yellow-500">★★★★★</span>
          <span class="ml-2 text-gray-600 text-sm">(11832 avis vérifiés)</span>
        </div>

        <!-- Contrôle de la quantité -->
        <div class="flex items-center mb-4">
          <button @click="decreaseQuantity" class="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded">-</button>
          <span class="mx-2">{{ quantity }}</span>
          <button @click="increaseQuantity" class="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded">+</button>
        </div>

        <!-- Bouton d'ajout au panier -->
        <button @click="addToCart" class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
          Ajouter au panier
        </button>
      </div>
    </div>

    <!-- Section pour afficher les produits similaires -->
    <div v-if="groupedSimilarProducts.length > 0" class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Produits Similaires</h2>

      <!-- Intégration du carousel avec 3 produits par slide -->
      <Carousel>
        <CarouselContent>
          <CarouselItem v-for="group in groupedSimilarProducts" :key="group[0]?.postgresId">
            <!-- Wrapper pour chaque slide contenant 3 produits -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                v-for="similarProduct in group" 
                :key="similarProduct.postgresId" 
                @click="goToProductDetail(similarProduct.postgresId)" 
                class="cursor-pointer mx-2"
              >
                <!-- Affichage de l'image du produit similaire -->
                <img 
                  :src="`${apiBaseUrl}/${similarProduct.imagePath}`" 
                  :alt="similarProduct.name" 
                  class="w-full h-40 object-cover rounded-md" 
                />
                <h3 class="text-center text-sm mt-2">{{ similarProduct.name }}</h3>
                <p class="text-center text-sm">{{ similarProduct.price }} €</p>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>

    <!-- Section pour la pub de Troupicool -->
    <div class="mt-12 p-6 bg-gradient rounded-lg text-center">
      <h3 class="text-2xl font-bold text-white mb-2">Découvrez la Magie des Saveurs Troupicool!</h3>
      <p class="text-white">Nos boissons naturelles sont fabriquées avec amour en France, en utilisant uniquement les meilleurs ingrédients. Rejoignez la famille Troupicool et goûtez à l'excellence à chaque gorgée!</p>
      <button class="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded">
        En savoir plus
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const isLoading = ref(true);
const product = ref<{
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;
  size: string;
  rating: number;
  description: string;
} | null>(null);

const quantity = ref(1);
const similarProducts = ref<Array<{
  postgresId: number;
  name: string;
  imagePath: string;
  category: string;
  price: number;
}>>([]);

const groupedSimilarProducts = ref<Array<Array<any>>>([]);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const groupProducts = (products: Array<any>, groupSize: number) => {
  const grouped = [];
  for (let i = 0; i < products.length; i += groupSize) {
    grouped.push(products.slice(i, i + groupSize));
  }
  return grouped;
};

const fetchProductDetails = async (id: number) => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${apiBaseUrl}/api/products/${id}`);
    const productData = response.data;

    product.value = {
      ...productData,
      image: productData.imagePath ? `${apiBaseUrl}/${productData.imagePath}` : 'path/to/default/image.jpg'
    };

    await fetchSimilarProducts(productData.category, productData.postgresId);
    isLoading.value = false;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du produit :', error);
    isLoading.value = false;
  }
};

const fetchSimilarProducts = async (productCategory: string, currentProductId: number) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/products/similar`, {
      params: {
        category: productCategory,
        id: currentProductId
      }
    });

    similarProducts.value = response.data.data.filter((p: any) => p.postgresId !== currentProductId);
    groupedSimilarProducts.value = groupProducts(similarProducts.value, 3);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits similaires :", error);
  }
};

const goToProductDetail = (productId: number) => {
  router.push({ name: 'product-product-detail', params: { id: productId } });
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

const addToCart = () => {
  if (product.value) {
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addProductToCart(product.value);
    }
    quantity.value = 1;
  }
};

onMounted(() => {
  const productId = Number(route.params.id);
  fetchProductDetails(productId);
});

watch(() => route.params.id, (newId) => {
  fetchProductDetails(Number(newId));
});
</script>

<style scoped>
.md\:mr-8 {
  margin-right: 2rem;
}

.bg-gradient {
  background: black;
}

.carousel-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.carousel img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>