<template>
  <nav class="relative flex items-center justify-between px-2 py-3 bg-white shadow mb-3">
    <div class="container mx-auto flex items-center justify-between">
      <!-- Hamburger icon for mobile (left side) -->
      <button
        @click="toggleNavbar"
        class="text-black cursor-pointer text-xl leading-none px-2 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none "
      >
        <Menu />
      </button>

      <!-- Logo -->
      <router-link to="/" class="flex items-center">
        <img src="@/assets/logo.svg" alt="Troupicool Logo" class="h-8 mr-2" />
        <span class="text-lg font-bold text-black">Troupicool</span>
      </router-link>

      <!-- Sidebar (menu mobile) -->
      <div>
        <div
          v-if="showMenu"
          class="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          @click="toggleNavbar"
        ></div>

        <div
          :class="{'translate-x-0': showMenu, '-translate-x-full': !showMenu}"
          class="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 lg:hidden"
        >
          <div class="flex items-center justify-between p-4">
            <router-link to="/" class="flex items-center">
              <img src="@/assets/logo.svg" alt="Troupicool Logo" class="h-8 mr-2" />
              <span class="text-lg font-bold text-black mr">Troupicool</span>
            </router-link>
            <button @click="toggleNavbar" class="text-black">
              <XIcon class="h-6 w-6" />
            </button>
          </div>
          <ul class="flex flex-col list-none space-y-4 p-4">
            <li v-for="link in links" :key="link.name" class="nav-item">
              <router-link 
                :to="link.path" 
                class="px-3 py-2 text-base font-regular leading-snug text-black"
                :class="{'active-link': isActive(link.path)}"
                @click="toggleNavbar"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Desktop Menu -->
      <div class="hidden lg:flex flex-grow items-center justify-center">
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

      <!-- Icons (visible on both mobile and desktop) -->
      <div class="flex items-center space-x-3">
        <router-link v-if="isAdmin" to="/admin" class="text-black">
          <Shield class="h-4 w-4"/>
        </router-link>

        <router-link 
          :to="isAuthenticated ? '/profile' : '/auth'" 
          class="text-black"
        >
          <img src="@/assets/user.svg" alt="User Profile" class="h-6 w-6" />
        </router-link>
        <router-link to="/cart" class="text-black">
          <img src="@/assets/cart.svg" alt="Shopping Cart" class="h-4 w-4" />
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { Menu, Shield } from 'lucide-vue-next';

const showMenu = ref(false);

const links = [
  { name: 'Accueil', path: '/' },
  { name: 'Produits', path: '/products' },
  { name: 'Catégories', path: '/categories' },
];

const toggleNavbar = () => {
  showMenu.value = !showMenu.value;
};

const route = useRoute();
const isActive = (path) => computed(() => route.path === path).value;

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.hasRole('ROLE_ADMIN'));
</script>
