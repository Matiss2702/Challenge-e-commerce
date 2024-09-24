<template>
  <aside class="admin-sidebar">
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-4">Admin Menu</h2>
    </div>

    <Accordion type="single" collapsible>
      <!-- Gestion des utilisateurs -->
      <AccordionItem value="manage-users">
        <AccordionTrigger>
          Gérer les utilisateurs
        </AccordionTrigger>
        <AccordionContent>
          <ul>
            <li><router-link to="/admin/users/add" class="text-gray-700">Ajouter un utilisateur</router-link></li>
            <li><router-link to="/admin/users" class="text-gray-700">Voir tous les utilisateurs</router-link></li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <!-- Gestion des produits -->
      <AccordionItem value="manage-products">
        <AccordionTrigger>
          Gérer les produits
        </AccordionTrigger>
        <AccordionContent>
          <ul>
            <li><router-link to="/admin/products/add" class="text-gray-700">Ajouter un produit</router-link></li>
            <li><router-link to="/admin/products" class="text-gray-700">Voir tous les produits</router-link></li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="manage-orders">
        <AccordionTrigger>
          Gérer les commandes
        </AccordionTrigger>
        <AccordionContent>
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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
</script>

<style scoped>
.admin-sidebar {
  width: 16rem;
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
}
</style>
