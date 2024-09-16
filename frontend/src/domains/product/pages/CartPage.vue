<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-6">Votre Panier</h1>

    <!-- Affichage d'un message si le panier est vide -->
    <div v-if="cartItems.length === 0" class="text-center text-gray-600">
      Votre panier est vide. Ajoutez des produits pour commencer vos achats!
    </div>

    <!-- Liste des produits dans le panier -->
    <div v-else>
      <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-center border-b py-4">
        <div @click="goToProductDetail(item.id)" class="flex items-center cursor-pointer">
          <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-md mr-4" />
          <div>
            <h2 class="text-lg font-semibold">{{ item.name }}</h2>
            <p class="text-gray-500">{{ item.category }}</p>
            <p v-if="item.originalPrice" class="text-red-500 line-through">{{ item.originalPrice }} €</p>
            <p>{{ item.price }} €</p>
          </div>
        </div>
        <div class="flex items-center">
          <button @click="decreaseQuantity(item)" class="bg-yellow-500 hover:bg-yellow-600  text-black px-2 py-1 rounded">-</button>
          <span class="mx-2">{{ item.quantity }}</span>
          <button @click="increaseQuantity(item)" class="bg-yellow-500 hover:bg-yellow-600  text-black px-2 py-1 rounded">+</button>
        </div>
      </div>

      <!-- Champ de saisie pour le code promo -->
      <div class="mt-4">
        <div class="flex items-center">
          <input v-model="promoCode" type="text" placeholder="Code Promo" class="border p-2 rounded" />
          <button @click="applyPromo" class="bg-yellow-500 hover:bg-yellow-600  text-black px-4 py-2 rounded ml-2">Appliquer</button>
        </div>
      </div>

      <!-- Affichage du code promo appliqué -->
      <div v-if="currentPromo">
        <hr class="my-4" /> <!-- Séparation par un trait uniquement si un code promo est appliqué -->
        <p class="text-green-600">Code Promo Appliqué: {{ currentPromo.code }} - Réduction de {{ currentPromo.discount }}%</p>
        <p class="text-gray-600">Économisez {{ calculateDiscountAmount() }} € grâce à ce code promo!</p>
        <p class="text-blue-600">Une réduction de {{ currentPromo.discount }}% a été appliquée sur votre total grâce au code promo!</p>
        <hr class="my-4" /> <!-- Séparation par un trait uniquement si un code promo est appliqué -->
      </div>

      <!-- Boutons de contrôle du panier -->
      <div class="flex justify-between items-center mt-6">
        <button @click="clearCart" class="bg-yellow-500 hover:bg-yellow-600  text-black px-4 py-2 rounded">Vider le Panier</button>
        <p class="text-xl font-bold">Total: {{ calculateTotal() }} €</p>
      </div>
    </div>
  </div>
</template>

  
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCartStore } from '@/stores/cartStore'; // Import du store Pinia
  
  const router = useRouter();
  const cartStore = useCartStore(); // Utilisation du store Pinia
  
  // State pour le code promo
  const promoCode = ref<string>('');
  
  // Liste des articles du panier
  const cartItems = cartStore.cartItems;
  
  // Récupération de la promo courante
  const currentPromo = cartStore.currentPromo;
  
  // Méthode pour appliquer le code promo
  const applyPromo = () => {
    cartStore.applyPromoCode(promoCode.value);
    promoCode.value = ''; // Réinitialise le champ
  };
  
  // Méthode pour rediriger vers le détail du produit
  const goToProductDetail = (productId: number) => {
    router.push({ name: 'product-product-detail', params: { id: productId } });
  };
  
  // Méthode pour augmenter la quantité d'un produit
  const increaseQuantity = (item: { id: number; name: string; price: number; image: string; category: string }) => {
    cartStore.addProductToCart(item);
  };
  
  // Méthode pour diminuer la quantité d'un produit
  const decreaseQuantity = (item: { id: number }) => {
    cartStore.removeProductFromCart(item.id);
  };
  
  // Méthode pour vider le panier
  const clearCart = () => {
    cartStore.clearCart();
  };
  
  // Méthode pour calculer le total avec réduction
  const calculateTotal = () => {
    return cartStore.calculateTotal();
  };
  
  // Méthode pour calculer le montant de la réduction
  const calculateDiscountAmount = () => {
    const totalWithoutDiscount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalWithDiscount = parseFloat(calculateTotal());
    return (totalWithoutDiscount - totalWithDiscount).toFixed(2);
  };
  </script>
  
  <style scoped>
  /* Styles additionnels pour le composant */
  </style>
  