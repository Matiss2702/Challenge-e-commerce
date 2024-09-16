import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<
    { id: number; name: string; price: number; quantity: number; image: string; category: string; originalPrice?: number }[]
  >([]);

  const promotions = ref<{ code: string; discount: number }[]>([
    { code: 'PROMO10', discount: 10 },
    { code: 'PROMO20', discount: 20 }
  ]);

  const currentPromo = ref<{ code: string; discount: number } | null>(null);
  const promoMessage = ref<string | null>(null);

  const addProductToCart = (product: { id: number; name: string; price: number; image: string; category: string; originalPrice?: number }) => {
    const existingProduct = cartItems.value.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cartItems.value.push({ ...product, quantity: 1 });
    }
  };

  const removeProductFromCart = (productId: number) => {
    const productIndex = cartItems.value.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
      if (cartItems.value[productIndex].quantity > 1) {
        cartItems.value[productIndex].quantity--;
      } else {
        cartItems.value.splice(productIndex, 1);
      }
    }
  };

  const clearCart = () => {
    cartItems.value = [];
    currentPromo.value = null;
    promoMessage.value = null;
  };

  const applyPromoCode = (code: string) => {
    const promo = promotions.value.find(p => p.code === code);
    if (promo) {
      currentPromo.value = promo;
      promoMessage.value = `Code Promo Appliqué: ${promo.code} - Réduction de ${promo.discount}%`;
      cartItems.value.forEach(item => {
        if (!item.originalPrice) {
          item.originalPrice = item.price;
        }
        item.price = item.originalPrice - (item.originalPrice * promo.discount) / 100;
      });
    } else {
      promoMessage.value = 'Code promo invalide.';
    }
  };

  const calculateTotal = () => {
    let total = cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return total.toFixed(2);
  };

  return {
    cartItems,
    addProductToCart,
    removeProductFromCart,
    clearCart,
    applyPromoCode,
    calculateTotal,
    currentPromo,
    promoMessage
  };
});
