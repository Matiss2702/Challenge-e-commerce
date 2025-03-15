<template>
  <div class="max-w-4xl px-4 py-8 mx-auto">
    <h1 class="mb-6 text-3xl font-bold">Votre Panier</h1>

    <div v-if="!cart || cart.CartItems.length === 0" class="text-center text-gray-600">Votre panier est vide.</div>
    <div v-else>
      <div v-for="item in cart.CartItems" :key="item.id" class="flex items-center justify-between py-4 border-b">
        <div class="flex items-center">
          <!-- Image du produit -->
          <img
            :src="item.Product?.imagePath ? apiBaseUrl + '/' + item.Product.imagePath : '/placeholder.jpg'"
            alt="Produit"
            class="object-cover w-20 h-20 mr-4 rounded-md"
          />
          <div>
            <h2 class="text-lg font-semibold">{{ item.Product?.name }}</h2>
            <p class="text-gray-500">{{ item.Product?.category }}</p>

            <!-- Vérification de la valeur du prix -->
            <p>
              Prix HT : {{ formatPrice(item.Product?.price) }} €
              <span v-if="item.Product?.isAgeRestricted">(+ 20% TVA)</span>
              <span v-else>(+ 5.5% TVA)</span>
            </p>

            <p>
              {{ (typeof item.price === "string" ? parseFloat(item.price) : item.price).toFixed(2) }} € x
              {{ item.quantity }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-6">
        <button @click="clearCart" class="px-4 py-2 text-black bg-yellow-500 rounded hover:bg-yellow-600">
          Vider le Panier
        </button>
        <p class="text-xl font-bold">Total: {{ total }} €</p>
      </div>

      <!-- Champ Code Promo -->
      <div class="mt-4">
        <label for="promoCode">Code Promo :</label>
        <input id="promoCode" v-model="promoCode" type="text" placeholder="PROMO10" class="p-1 ml-2 border" />
      </div>

      <!-- Bouton de paiement Stripe -->
      <div class="mt-6">
        <button @click="checkout" class="px-4 py-2 font-bold text-black bg-yellow-500 rounded hover:bg-yellow-600">
          Payer avec Stripe
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

const cartStore = useCartStore();
const authStore = useAuthStore();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const promoCode = ref("");

onMounted(() => {
  cartStore.fetchCart();
});

const cart = computed(() => cartStore.cart);
const total = computed(() => cartStore.calculateTotal());

function clearCart() {
  cartStore.clearCart();
}

function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null) return "0.00";
  return parseFloat(price.toString()).toFixed(2);
}

async function checkout() {
  try {
    const items = (cart.value?.CartItems || []).map((item: CartItem) => ({
      product_id: item.product_id,
      name: item.Product?.name || "Sans nom",
      description: item.Product?.description || "Aucune description",
      price: item.price ? parseFloat(item.price.toString()) : 0,
      quantity: item.quantity,
    }));

    const shipping_details = {
      address: "12 rue de la Paix",
      city: "Paris",
      postal_code: "75000",
      country: "FR",
      shipping_method: "standard",
    };

    const token = localStorage.getItem("token") || "";
    const response = await fetch(`${apiBaseUrl}/api/stripe/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
        client_reference_id: authStore.user?.postgresId || 0,
        shipping_details,
        promoCode: promoCode.value,
      }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur lors de la création de la session Stripe.");
    }
  } catch (error) {
    console.error("Erreur lors de la redirection vers Stripe:", error);
    alert("Une erreur est survenue lors du paiement. Veuillez réessayer.");
  }
}
</script>
