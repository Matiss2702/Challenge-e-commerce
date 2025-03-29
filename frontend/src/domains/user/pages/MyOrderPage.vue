<template>
  <div class="max-w-6xl px-4 py-8 mx-auto">
    <h1 class="mb-8 text-3xl font-bold text-center text-orange-600">Mon Historique de Commandes</h1>

    <div v-if="orders.length > 0" class="space-y-6">
      <div
        v-for="order in orders"
        :key="order._id || order.postgresId"
        class="overflow-hidden border border-gray-200 rounded-lg shadow-md"
      >
        <div class="flex items-center justify-between px-6 py-4 bg-orange-50">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Order #{{ order.postgresId }}</h2>
            <p class="text-sm text-gray-600">
              Status:
              <span
                class="font-medium"
                :class="{
                  'text-yellow-500': order.status === 'pending',
                  'text-green-600': order.status === 'paid',
                  'text-red-500': order.status === 'canceled',
                  'text-blue-500': order.status === 'shipped',
                }"
              >
                {{ statusLabels[order.status] || order.status }}
              </span>
            </p>
          </div>
          <div class="text-lg font-semibold text-orange-600">{{ order.total_amount.toFixed(2) }} €</div>
        </div>

        <div class="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="item in order.items"
            :key="item.product_id"
            class="flex overflow-hidden bg-white border border-gray-100 rounded-md shadow-sm"
          >
            <img :src="item.image" alt="Produit" class="object-cover w-24 h-24" />
            <div class="flex flex-col justify-center px-4 py-2">
              <h3 class="font-semibold text-gray-800">
                {{ item.name }}
              </h3>
              <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
              <p class="text-sm text-gray-600">Price: {{ item.price }} €</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-8 text-center text-gray-500">No orders found.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  name?: string;
  imagePath?: string;
  image?: string;
}

interface Order {
  _id?: string;
  postgresId?: string;
  user_id?: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
}

const statusLabels: Record<string, string> = {
  pending: "En cours",
  paid: "Payée",
  canceled: "Abandonnée",
  shipped: "En livraison",
  delivered: "Livrée",
};

const orders = ref<Order[]>([]);
const authStore = useAuthStore();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const baseImageUrl = `${apiBaseUrl}/`;

onMounted(async () => {
  try {
    const token = authStore.token;
    if (!token) return;

    const response = await axios.get(`${apiBaseUrl}/api/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    orders.value = response.data.map((order: any) => ({
      ...order,
      items: order.items.map((item: any) => ({
        ...item,
        image: item.imagePath ? baseImageUrl + item.imagePath : "/default-product.jpg",
      })),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
  }
});
</script>
