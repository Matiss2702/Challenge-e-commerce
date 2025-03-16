<template>
  <nav class="relative flex items-center justify-between px-2 py-3 mb-3 bg-white shadow">
    <div class="container flex items-center justify-between mx-auto">
      <!-- Hamburger icon for mobile -->
      <button
        @click="toggleNavbar"
        class="block px-2 py-1 text-xl leading-none text-black bg-transparent border border-transparent border-solid rounded outline-none cursor-pointer lg:hidden focus:outline-none"
      >
        <Menu />
      </button>

      <!-- Logo -->
      <router-link to="/" class="flex items-center">
        <img src="@/assets/logo.svg" alt="Troupicool Logo" class="h-8 mr-2" />
        <span class="text-lg font-bold text-black">Troupicool</span>
      </router-link>

      <!-- Mobile Sidebar -->
      <div>
        <div v-if="showMenu" class="fixed inset-0 z-40 bg-black opacity-50 lg:hidden" @click="toggleNavbar"></div>
        <div
          :class="{ 'translate-x-0': showMenu, '-translate-x-full': !showMenu }"
          class="fixed top-0 left-0 z-50 w-64 h-full transition-transform duration-300 transform bg-white shadow-lg lg:hidden"
        >
          <div class="flex items-center justify-between p-4">
            <router-link to="/" class="flex items-center">
              <img src="@/assets/logo.svg" alt="Troupicool Logo" class="h-8 mr-2" />
              <span class="text-lg font-bold text-black">Troupicool</span>
            </router-link>
            <button @click="toggleNavbar" class="text-black">
              <XIcon class="w-6 h-6" />
            </button>
          </div>
          <ul class="flex flex-col p-4 space-y-4 list-none">
            <li v-for="link in links" :key="link.name" class="nav-item">
              <router-link
                :to="link.path"
                class="px-3 py-2 text-base leading-snug text-black font-regular"
                :class="{ 'active-link': isActive(link.path) }"
                @click="toggleNavbar"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Desktop Menu -->
      <div class="items-center justify-center flex-grow hidden lg:flex">
        <ul class="flex flex-row space-x-6 text-center list-none">
          <li v-for="link in links" :key="link.name" class="nav-item">
            <router-link
              :to="link.path"
              class="px-3 py-2 text-base leading-snug text-black font-regular"
              :class="{ 'active-link': isActive(link.path) }"
            >
              {{ link.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Icons -->
      <div class="flex items-center space-x-3">
        <!-- Afficher le lien admin si ROLE_ADMIN ou ROLE_STORE_KEEPER -->
        <router-link v-if="isAdmin || isMagazinier" :to="adminLink" class="text-black">
          <Shield class="w-4 h-4" />
        </router-link>
        <router-link :to="isAuthenticated ? '/profile' : '/auth'" class="text-black">
          <img src="@/assets/user.svg" alt="User Profile" class="w-6 h-6" />
        </router-link>
        <router-link to="/cart" class="text-black">
          <img src="@/assets/cart.svg" alt="Shopping Cart" class="w-4 h-4" />
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { Menu, XIcon, Shield } from "lucide-vue-next";

const showMenu = ref(false);
const links = [
  { name: "Accueil", path: "/" },
  { name: "Produits", path: "/products" },
  { name: "Catégories", path: "/categories" },
];

const toggleNavbar = () => {
  showMenu.value = !showMenu.value;
};

const route = useRoute();
const isActive = (path: string): boolean => route.path === path;

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.hasRole("ROLE_ADMIN"));
const isMagazinier = computed(() => authStore.hasRole("ROLE_STORE_KEEPER"));

const adminLink = computed(() => {
  if (isAdmin.value) {
    console.log("User is admin, adminLink = /admin");
    return "/admin";
  }
  if (isMagazinier.value) {
    console.log("User is magazinier, adminLink = /admin/products");
    return "/admin/products";
  }
  return "";
});
</script>
