<template>
  <aside
    class="transition-all duration-300 ease-in-out admin-sidebar"
    :class="{ 'w-16': !isSidebarOpen, 'w-64': isSidebarOpen }"
    @mouseenter="openSidebar"
    @mouseleave="closeSidebar"
  >
    <div class="mb-4" v-if="isSidebarOpen">
      <h2 class="mb-4 text-xl font-bold">Admin Menu</h2>
    </div>

    <Accordion type="single" collapsible>
      <AccordionItem v-if="isAdmin" value="manage-users">
        <AccordionTrigger>
          <span class="flex items-center">
            <UsersIcon />
            <span v-if="isSidebarOpen">Gérer les utilisateurs</span>
          </span>
        </AccordionTrigger>
        <AccordionContent v-if="isSidebarOpen">
          <ul>
            <li>
              <router-link to="/admin/users/add" class="text-gray-700"> Ajouter un utilisateur </router-link>
            </li>
            <li>
              <router-link to="/admin/users" class="text-gray-700"> Voir tous les utilisateurs </router-link>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <!-- Gérer les produits -->
      <AccordionItem value="manage-products">
        <AccordionTrigger>
          <span class="flex items-center">
            <PackageIcon />
            <span v-if="isSidebarOpen">Gérer les produits</span>
          </span>
        </AccordionTrigger>
        <AccordionContent v-if="isSidebarOpen">
          <ul>
            <template v-if="isAdmin">
              <li>
                <router-link to="/admin/products/add" class="text-gray-700"> Ajouter un produit </router-link>
              </li>
              <li>
                <router-link to="/admin/products" class="text-gray-700"> Voir tous les produits </router-link>
              </li>
            </template>
            <!-- Pour le magasinier : uniquement la liste des produits -->
            <template v-else-if="isMagazinier">
              <li>
                <router-link to="/admin/products" class="text-gray-700"> Voir tous les produits </router-link>
              </li>
            </template>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { UsersIcon, PackageIcon } from "lucide-vue-next";

const isSidebarOpen = ref(false);
const openSidebar = () => {
  isSidebarOpen.value = true;
};
const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.hasRole("ROLE_ADMIN"));
const isMagazinier = computed(() => authStore.hasRole("ROLE_STORE_KEEPER"));
</script>

<style scoped>
.admin-sidebar {
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
  transition: width 0.3s ease-in-out;
}

.admin-sidebar.w-16 {
  width: 4rem;
}

.admin-sidebar.w-64 {
  width: 16rem;
}
</style>
