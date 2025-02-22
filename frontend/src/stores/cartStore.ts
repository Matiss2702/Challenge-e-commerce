import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export interface CartItem {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  originalPrice?: number;
}

interface Promotion {
  code: string;
  discount: number;
}

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref<CartItem[]>([]);

  // Liste de promotions
  const promotions = ref<Promotion[]>([
    { code: "PROMO10", discount: 10 },
    { code: "PROMO20", discount: 20 },
  ]);
  const currentPromo = ref<Promotion | null>(null);

  const loadProductsFromAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
      const products = response.data; // Supposons un tableau

      products.forEach((raw: any) => {
        addProductToCart(raw);
      });
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
    }
  };

  const addProductToCart = (rawProduct: any) => {
    const itemId = rawProduct._id || rawProduct.id;

    const product: CartItem = {
      id: itemId,
      name: rawProduct.name,
      description: rawProduct.description || "",
      price: rawProduct.price || 0,
      quantity: rawProduct.quantity || 1,
      image: rawProduct.image || "",
      category: rawProduct.category || "",
    };
    console.log("Produit ajouté au panier:", product);
    const existingProduct = cartItems.value.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      cartItems.value.push(product);
    }
  };

  /**
   * Supprimer un produit (ou décrémenter) du panier
   */
  const removeProductFromCart = (productId: number | string) => {
    const productIndex = cartItems.value.findIndex((item) => item.id === productId);
    if (productIndex !== -1) {
      if (cartItems.value[productIndex].quantity > 1) {
        cartItems.value[productIndex].quantity--;
      } else {
        cartItems.value.splice(productIndex, 1);
      }
    }
  };

  /**
   * Vider le panier
   */
  const clearCart = () => {
    cartItems.value = [];
    currentPromo.value = null;
  };

  /**
   * Appliquer un code promo
   */
  const applyPromoCode = (code: string) => {
    const promo = promotions.value.find((p) => p.code === code);
    if (promo) {
      currentPromo.value = promo;
      cartItems.value.forEach((item) => {
        // Conserve le prix d'origine si pas déjà fait
        if (!item.originalPrice) {
          item.originalPrice = item.price;
        }
        // Applique la promo
        item.price = item.originalPrice - (item.originalPrice * promo.discount) / 100;
      });
    }
  };

  /**
   * Calculer le total du panier
   */
  const calculateTotal = () => {
    return cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  return {
    cartItems,
    promotions,
    currentPromo,
    loadProductsFromAPI,
    addProductToCart,
    removeProductFromCart,
    clearCart,
    applyPromoCode,
    calculateTotal,
  };
});
