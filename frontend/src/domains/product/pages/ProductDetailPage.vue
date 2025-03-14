<template>
  <div v-if="product" class="max-w-4xl px-4 py-8 mx-auto">
    <!-- Affichage de l'image du produit -->
    <div class="flex flex-col items-center md:flex-row md:items-start">
      <img
        :src="product.image"
        :alt="product.name"
        class="object-cover w-full mb-4 rounded-lg md:w-1/2 md:mb-0 md:mr-8"
      />

      <!-- Détails du produit -->
      <div class="flex-grow">
        <h1 class="mb-4 text-3xl font-bold">{{ product.name }}</h1>
        <p class="mb-2 text-gray-700">{{ product.category }}</p>
        <p class="mb-2 text-green-600">{{ product.description }}</p>
        <p class="mb-2 text-gray-500">{{ product.price }} €</p>
        <div class="flex items-center mb-2">
          <span class="text-yellow-500">★★★★★</span>
          <span class="ml-2 text-sm text-gray-600">(11832 avis vérifiés)</span>
        </div>

        <!-- Contrôle de la quantité -->
        <div class="flex items-center mb-4">
          <button @click="decreaseQuantity" class="px-2 py-1 text-black bg-yellow-500 rounded hover:bg-yellow-600">
            -
          </button>
          <span class="mx-2">{{ quantity }}</span>
          <button @click="increaseQuantity" class="px-2 py-1 text-black bg-yellow-500 rounded hover:bg-yellow-600">
            +
          </button>
        </div>

        <!-- Bouton d'ajout au panier -->
        <button @click="addToCart" class="px-4 py-2 font-bold text-black bg-yellow-500 rounded hover:bg-yellow-600">
          Ajouter au panier
        </button>
      </div>
    </div>

    <!-- Section pour afficher les produits similaires -->
    <div v-if="groupedSimilarProducts.length > 0" class="mt-8">
      <h2 class="mb-4 text-2xl font-bold">Produits Similaires</h2>

      <!-- Carousel -->
      <Carousel>
        <CarouselContent>
          <CarouselItem v-for="group in groupedSimilarProducts" :key="group[0]?.postgresId">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div
                v-for="similarProduct in group"
                :key="similarProduct.postgresId"
                @click="goToProductDetail(similarProduct.postgresId)"
                class="mx-2 cursor-pointer"
              >
                <img
                  :src="`${apiBaseUrl}/${similarProduct.imagePath}`"
                  :alt="similarProduct.name"
                  class="object-cover w-full h-40 rounded-md"
                />
                <h3 class="mt-2 text-sm text-center">{{ similarProduct.name }}</h3>
                <p class="text-sm text-center">{{ similarProduct.price }} €</p>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>

    <!-- Section pub Troupicool -->
    <div class="p-6 mt-12 text-center rounded-lg bg-gradient">
      <h3 class="mb-2 text-2xl font-bold text-white">Découvrez la Magie des Saveurs Troupicool!</h3>
      <p class="text-white">
        Nos boissons naturelles sont fabriquées avec amour en France, en utilisant uniquement les meilleurs ingrédients.
        Rejoignez la famille Troupicool et goûtez à l'excellence à chaque gorgée!
      </p>
      <button class="px-6 py-2 mt-4 font-bold text-black bg-yellow-500 rounded hover:bg-yellow-600">
        En savoir plus
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const isLoading = ref(true);
const product = ref<any>(null);
const quantity = ref(1);

const similarProducts = ref<Array<any>>([]);
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
      id: productData.postgresId,
      name: productData.name,
      category: productData.category,
      price: productData.price,
      description: productData.description,
      image: productData.imagePath ? `${apiBaseUrl}/${productData.imagePath}` : "path/to/default/image.jpg",
    };

    await fetchSimilarProducts(product.value.category, productData.postgresId);
    isLoading.value = false;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du produit :", error);
    isLoading.value = false;
  }
};

const fetchSimilarProducts = async (productCategory: string, currentProductId: number) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/products/similar`, {
      params: {
        category: productCategory,
        id: currentProductId,
      },
    });
    similarProducts.value = response.data.data.filter((p: any) => p.postgresId !== currentProductId);
    groupedSimilarProducts.value = groupProducts(similarProducts.value, 3);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits similaires :", error);
  }
};

const goToProductDetail = (productId: number) => {
  router.push({ name: "product-product-detail", params: { id: productId } });
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

const addToCart = async () => {
  if (product.value) {
    try {
      await cartStore.addProductToCart(product.value.id, quantity.value);
      quantity.value = 1;
    } catch (err) {
      console.error("Erreur addToCart:", err);
    }
  }
};

onMounted(() => {
  const productId = Number(route.params.id);
  fetchProductDetails(productId);
});

watch(
  () => route.params.id,
  (newId) => {
    fetchProductDetails(Number(newId));
  }
);
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
