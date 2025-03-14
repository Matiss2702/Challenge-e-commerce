<template>
  <button @click="checkout" class="px-4 py-2 font-bold text-black bg-yellow-500 rounded hover:bg-yellow-600">
    Payer avec Stripe
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import axios from "axios";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

const cartStore = useCartStore();
const authStore = useAuthStore();

const shipping_details = {
  address: "12 rue de la Paix",
  city: "Paris",
  postal_code: "75000",
  country: "FR",
  shipping_method: "standard",
};

const cartItems = computed(() => cartStore.cart?.CartItems || []);

async function checkout() {
  try {
    const token = localStorage.getItem("token") || "";
    const userId = authStore.user?.postgresId;
    const userIdInt = parseInt(userId || "", 10) || 0;

    const items = cartItems.value.map((item) => {
      const price = item.Product?.price || 0;
      const name = item.Product?.name || "Nom indisponible";
      let description = item.Product?.description || "";

      // **Éviter d'envoyer une description vide** :
      if (!description) {
        description = "Aucune description";
      }

      return {
        product_id: item.product_id,
        name,
        description,
        price,
        quantity: item.quantity,
      };
    });

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/stripe/create-checkout-session`,
      {
        items,
        client_reference_id: userIdInt,
        shipping_details,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    window.location.href = response.data.url;
  } catch (error) {
    console.error("Erreur lors de la redirection vers Stripe Checkout:", error);
    alert("Une erreur est survenue lors du paiement. Veuillez réessayer.");
  }
}
</script>
