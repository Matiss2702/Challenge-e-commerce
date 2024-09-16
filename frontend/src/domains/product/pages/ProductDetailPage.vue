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
            <!-- Étoiles de notation en brut pour le moment -->
            <span class="text-yellow-500">★★★★★</span>
            <span class="ml-2 text-gray-600 text-sm">(11832 avis vérifiés)</span>
          </div>
  
          <!-- Contrôle de la quantité -->
          <div class="flex items-center mb-4">
            <button @click="decreaseQuantity" class="bg-yellow-500 hover:bg-yellow-600  text-black px-2 py-1 rounded">-</button>
            <span class="mx-2">{{ quantity }}</span>
            <button @click="increaseQuantity" class="bg-yellow-500 hover:bg-yellow-600  text-black px-2 py-1 rounded">+</button>
          </div>
  
          <!-- Bouton d'ajout au panier -->
          <button @click="addToCart" class="bg-yellow-500 hover:bg-yellow-600  text-black font-bold py-2 px-4 rounded">
            Ajouter au panier
          </button>
        </div>
      </div>
  
      <!-- Section pour afficher les produits similaires -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Produits Similaires</h2>
        <div class="flex space-x-4">
          <div
            v-for="similarProduct in similarProducts"
            :key="similarProduct.id"
            @click="goToProductDetail(similarProduct.id)"
            class="cursor-pointer"
          >
            <img :src="similarProduct.image" :alt="similarProduct.name" class="w-20 h-20 object-cover rounded-md" />
          </div>
        </div>
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
  import { useCartStore } from '@/stores/cartStore'; // Import du store Pinia
  
  const route = useRoute();
  const router = useRouter();
  const cartStore = useCartStore(); // Utilisation du store Pinia
  
  // Déclaration du produit
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
  
  // Quantité de produit
  const quantity = ref(1);
  
  // Liste des produits similaires
  const similarProducts = ref<Array<{
    id: number;
    name: string;
    image: string;
    category: string;
    price: number;
  }>>([]);
  
  // Import des images
  import productMyrtille from '@/assets/produit-myrtille.svg';
  import productFraise from '@/assets/produit-fraise.svg';
  import productKiwi from '@/assets/produit-kiwi.svg';
  
  // Liste statique des produits pour la simulation
  const products = [
    {
      id: 1,
      name: 'Jus de Myrtille',
      image: productMyrtille,
      category: 'Bouteilles',
      price: 4.5,
      size: '50cl',
      rating: 4.5,
      description: 'Découvrez notre délicieux jus de myrtille, récolté à la main dans les champs de France. Riche en antioxydants, il apporte fraîcheur et vitalité à chaque gorgée.'
    },
    {
      id: 2,
      name: 'Jus de Fraise',
      image: productFraise,
      category: 'Bouteilles',
      price: 4.5,
      size: '50cl',
      rating: 4.8,
      description: 'Un jus de fraise naturellement sucré, sans additifs, qui capture toute l’essence des fraises françaises les plus juteuses. Un plaisir à savourer en toutes saisons.'
    },
    {
      id: 3,
      name: 'Jus de Kiwi',
      image: productKiwi,
      category: 'Bouteilles',
      price: 4.5,
      size: '50cl',
      rating: 4.6,
      description: 'Notre jus de kiwi est une explosion de saveurs tropicales, parfait pour les amateurs de sensations acidulées. Fait avec des kiwis 100% français, il est riche en vitamine C.'
    },
  ];
  
  // Fonction pour récupérer les détails du produit par ID
  const fetchProductDetails = (id: number) => {
    const foundProduct = products.find((prod) => prod.id === id);
    if (foundProduct) {
      product.value = foundProduct;
      // Filtre les produits similaires par catégorie
      similarProducts.value = products.filter(
        (prod) => prod.category === foundProduct.category && prod.id !== foundProduct.id
      );
    }
  };
  
  // Fonction pour rediriger vers le détail d'un autre produit
  const goToProductDetail = (productId: number) => {
    router.push({ name: 'product-product-detail', params: { id: productId } });
  };
  
  // Augmenter la quantité de produit
  const increaseQuantity = () => {
    quantity.value++;
  };
  
  // Diminuer la quantité de produit
  const decreaseQuantity = () => {
    if (quantity.value > 1) quantity.value--;
  };
  
  // Ajoute le produit au panier avec la quantité spécifiée
  const addToCart = () => {
    if (product.value) {
      for (let i = 0; i < quantity.value; i++) {
        cartStore.addProductToCart(product.value);
      }
      quantity.value = 1; // Réinitialise la quantité après l'ajout
    }
  };
  
  // Utilisation du hook onMounted pour charger les détails du produit lors du montage du composant
  onMounted(() => {
    const productId = Number(route.params.id);
    fetchProductDetails(productId);
  });
  
  // Watcher pour détecter les changements dans l'ID de la route
  watch(() => route.params.id, (newId) => {
    fetchProductDetails(Number(newId));
  });
  </script>
  
  <style scoped>
  /* Styles additionnels pour le composant */
  .md\:mr-8 {
    margin-right: 2rem; /* Espacement plus large entre l'image et la section des détails */
  }
  
  .bg-gradient {
    background: black; /* Argent clair */

  }
  .bg-gradient-silver {
    background: linear-gradient(to right, 
      #C0C0C0 0%,   /* Argent clair */
      #A9A9A9 25%,  /* Gris foncé pour plus de contraste */
      #A9A9A9 75%,  /* Gris foncé pour continuer le contraste */
      #C0C0C0 100%  /* Argent clair */
    );
  }
  
  .text-blue-600 {
    color: #3182ce; /* Couleur du texte pour la section publicitaire */
  }
  </style>
  