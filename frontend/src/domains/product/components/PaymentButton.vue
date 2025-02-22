<template>
  <button @click="checkout" class="px-4 py-2 font-bold text-black bg-yellow-500 rounded hover:bg-yellow-600">
    Payer avec Stripe
  </button>
</template>

<script setup lang="ts">
import axios from "axios";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { onMounted } from "vue";
const cartStore = useCartStore();
const authStore = useAuthStore();

// Exemple de shipping details, à adapter
const shipping_details = {
  address: "12 rue de la Paix",
  city: "Paris",
  postal_code: "75000",
  country: "FR",
  shipping_method: "standard",
};

const checkout = async () => {
  try {
    const token = localStorage.getItem("token"); // si vous gérez un token d'auth

    // On construit le tableau "items" pour l'API Stripe
    const items = cartStore.cartItems.map((item) => {
      if (!item.id) {
        console.error("Erreur : Produit sans ID détecté.", item);
        throw new Error("Tous les produits doivent avoir un ID.");
      }

      return {
        product_id: item.id, // côté back, on attend "product_id"
        name: item.name,
        description: item.description || "",
        price: item.price,
        quantity: item.quantity,
      };
    });

    // Si l'utilisateur a un "postgresId"
    const userId = authStore.user?.postgresId;
    // Convertir en entier
    const userIdInt = parseInt(userId, 10) || 0;

    // Appel vers votre backend Stripe
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
};

onMounted(() => {
  console.log("ici");
});
</script>

<style scoped></style>
