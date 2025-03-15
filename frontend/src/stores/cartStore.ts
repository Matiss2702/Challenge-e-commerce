import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/components/ui/toast/use-toast";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export interface ProductData {
  id: number;
  name: string;
  price: number;
  imagePath?: string;
  category?: string;
  description?: string;
  isAgeRestricted?: boolean;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number | string;
  Product?: ProductData;
}

interface Cart {
  id: number;
  user_id: number;
  status: string;
  CartItems: CartItem[];
}

export const useCartStore = defineStore("cart", () => {
  const cart = ref<Cart | null>(null);

  const authStore = useAuthStore();
  const authHeaders = computed(() => ({
    Authorization: `Bearer ${authStore.token}`,
  }));

  // Récupère le panier
  async function fetchCart() {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/cart`, {
        headers: authHeaders.value,
      });
      cart.value = res.data;
    } catch (err) {
      console.error("Erreur fetchCart:", err);
      cart.value = null;
    }
  }

  // Ajouter un produit
  async function addProductToCart(product_id: number, quantity = 1) {
    try {
      await axios.post(`${apiBaseUrl}/api/cart/items`, { product_id, quantity }, { headers: authHeaders.value });
      toast({
        title: "Succès",
        description: "Le produit a été ajouté au panier.",
        variant: "default",
      });
      await fetchCart();
    } catch (err: any) {
      console.error("Erreur addProductToCart:", err);
      if (err.response?.status === 403) {
        toast({
          title: "Erreur",
          description: err.response.data?.error || "Vous n'avez pas l'âge requis.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: err.response?.data?.error || "Impossible d'ajouter ce produit.",
          variant: "destructive",
        });
      }
    }
  }

  // Mettre à jour
  async function updateCartItem(itemId: number, newQuantity: number) {
    try {
      await axios.patch(
        `${apiBaseUrl}/api/cart/items/${itemId}`,
        { quantity: newQuantity },
        { headers: authHeaders.value }
      );
      await fetchCart();
      toast({
        title: "Quantité mise à jour",
        description: `L'article ${itemId} est maintenant à ${newQuantity}.`,
        variant: "default",
      });
    } catch (err) {
      console.error("Erreur updateCartItem:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité.",
        variant: "destructive",
      });
    }
  }

  // Retirer
  async function removeCartItem(itemId: number) {
    try {
      await axios.delete(`${apiBaseUrl}/api/cart/items/${itemId}`, {
        headers: authHeaders.value,
      });
      await fetchCart();
      toast({
        title: "Article retiré",
        description: `L'article ${itemId} a été retiré du panier.`,
        variant: "default",
      });
    } catch (err) {
      console.error("Erreur removeCartItem:", err);
      toast({
        title: "Erreur",
        description: "Impossible de retirer l'article.",
        variant: "destructive",
      });
    }
  }

  // Vider
  async function clearCart() {
    try {
      await axios.delete(`${apiBaseUrl}/api/cart/clear`, {
        headers: authHeaders.value,
      });
      cart.value = null;
      toast({
        title: "Panier vidé",
        description: "Votre panier est maintenant vide.",
        variant: "default",
      });
    } catch (err) {
      console.error("Erreur clearCart:", err);
      toast({
        title: "Erreur",
        description: "Impossible de vider le panier.",
        variant: "destructive",
      });
    }
  }

  // Calcul total
  function calculateTotal() {
    if (!cart.value || !cart.value.CartItems) return "0.00";
    let total = 0;
    cart.value.CartItems.forEach((item) => {
      const itemPrice = typeof item.price === "number" ? item.price : parseFloat(item.price);
      if (!isNaN(itemPrice)) {
        total += itemPrice * item.quantity;
      }
    });
    return total.toFixed(2);
  }

  return {
    cart,
    fetchCart,
    addProductToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    calculateTotal,
  };
});
