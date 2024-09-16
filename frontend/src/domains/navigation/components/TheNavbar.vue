<template>
  <nav class="relative flex items-center justify-between px-4 py-3 bg-white shadow mb-3">
    <div class="container mx-auto flex items-center justify-between">
      <router-link to="/" class="flex items-center">
        <img src="@/assets/logo.svg" alt="Troupicool Logo" class="h-8 mr-2" />
        <span class="text-lg font-bold text-black">Troupicool</span>
      </router-link>
      <div class="flex-grow flex items-center justify-center">
        <ul class="flex flex-row list-none text-center space-x-6">
          <li v-for="link in links" :key="link.name" class="nav-item">
            <router-link 
              :to="link.path" 
              class="px-3 py-2 text-base font-regular leading-snug text-black"
              :class="{'active-link': isActive(link.path)}"
            >
              {{ link.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="flex items-center space-x-4">
        <router-link 
          :to="isAuthenticated ? '/profile' : '/auth'" 
          class="text-black"
        >
          <img src="@/assets/user.svg" alt="User Profile" class="h-7 w-7" />
        </router-link>

        <router-link to="/cart" class="text-black">
          <img src="@/assets/cart.svg" alt="Shopping Cart" class="h-5 w-5" />
        </router-link>
      </div>
      <button
        @click="toggleNavbar"
        class="text-black cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
      >
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const showMenu = ref(false);

const links = [
  { name: 'Accueil', path: '/' },
  { name: 'Produits', path: '/products' },
  { name: 'Catégories', path: '/categories' },
  { name: 'À propos', path: '/about' },
  { name: 'Contact', path: '/contact' }
];

const toggleNavbar = () => {
  showMenu.value = !showMenu.value;
};

const route = useRoute();
const isActive = (path) => computed(() => route.path === path).value;

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

const userProfileLink = computed(() => (isAuthenticated.value ? '/profile' : '/auth'));
</script>
