<template>
  <aside
    class="admin-sidebar transition-all duration-300 ease-in-out"
    :class="{ 'w-16': !isSidebarOpen, 'w-64': isSidebarOpen }"
    @mouseenter="openSidebar"
    @mouseleave="closeSidebar"
  >
    <div class="mb-4" v-if="isSidebarOpen">
      <h2 class="text-xl font-bold mb-4">Admin Menu</h2>
    </div>

    <Accordion type="single" collapsible>
      <!-- Gestion des utilisateurs -->
      <AccordionItem value="manage-users">
        <AccordionTrigger>
          <span class="flex items-center">
            <UsersIcon />
            <span v-if="isSidebarOpen">Gérer les utilisateurs</span>
          </span>
        </AccordionTrigger>
        <AccordionContent v-if="isSidebarOpen">
          <ul>
            <li><router-link to="/admin/users/add" class="text-gray-700">Ajouter un utilisateur</router-link></li>
            <li><router-link to="/admin/users" class="text-gray-700">Voir tous les utilisateurs</router-link></li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <!-- Gestion des produits -->
      <AccordionItem value="manage-products">
        <AccordionTrigger>
          <span class="flex items-center">
            <PackageIcon />
            <span v-if="isSidebarOpen">Gérer les produits</span>
          </span>
        </AccordionTrigger>
        <AccordionContent v-if="isSidebarOpen">
          <ul>
            <li><router-link to="/admin/products/add" class="text-gray-700">Ajouter un produit</router-link></li>
            <li><router-link to="/admin/products" class="text-gray-700">Voir tous les produits</router-link></li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <!-- Gestion des commandes -->
      <AccordionItem value="manage-orders">
        <AccordionTrigger>
          <span class="flex items-center">
            <ShoppingCartIcon />
            <span v-if="isSidebarOpen">Gérer les commandes</span>
          </span>
        </AccordionTrigger>
        <AccordionContent v-if="isSidebarOpen">
          <ul>
            <li><a href="#" class="text-gray-700">Voir toutes les commandes</a></li>
            <li><a href="#" class="text-gray-700">Commandes en attente</a></li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';

// Import des icônes de Lucide
import { UsersIcon, PackageIcon, ShoppingCartIcon } from 'lucide-vue-next';

// État pour la sidebar
const isSidebarOpen = ref(false);

// Fonctions pour gérer l'ouverture et la fermeture de la sidebar
const openSidebar = () => {
  isSidebarOpen.value = true;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
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
