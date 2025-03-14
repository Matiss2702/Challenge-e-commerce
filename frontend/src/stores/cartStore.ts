import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface ProductData {
  id: number;
  name: string;
  price: number;
  imagePath?: string;
  category?: string;
  description?: string;
}

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
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

  async function addProductToCart(product_id: number, quantity = 1) {
    try {
      await axios.post(`${apiBaseUrl}/api/cart/items`, { product_id, quantity }, { headers: authHeaders.value });
      await fetchCart();
    } catch (err) {
      console.error("Erreur addProductToCart:", err);
    }
  }

  async function updateCartItem(itemId: number, newQuantity: number) {
    try {
      await axios.patch(
        `${apiBaseUrl}/api/cart/items/${itemId}`,
        { quantity: newQuantity },
        { headers: authHeaders.value }
      );
      await fetchCart();
    } catch (err) {
      console.error("Erreur updateCartItem:", err);
    }
  }

  async function removeCartItem(itemId: number) {
    try {
      await axios.delete(`${apiBaseUrl}/api/cart/items/${itemId}`, {
        headers: authHeaders.value,
      });
      await fetchCart();
    } catch (err) {
      console.error("Erreur removeCartItem:", err);
    }
  }

  async function clearCart() {
    try {
      await axios.delete(`${apiBaseUrl}/api/cart/clear`, {
        headers: authHeaders.value,
      });
      cart.value = null;
    } catch (err) {
      console.error("Erreur clearCart:", err);
    }
  }

  function calculateTotal() {
    if (!cart.value || !cart.value.CartItems) return 0;
    let total = 0;
    cart.value.CartItems.forEach((item) => {
      const price = item.Product?.price ?? 0;
      total += price * item.quantity;
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
