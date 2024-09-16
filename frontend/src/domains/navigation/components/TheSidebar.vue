<template>
    <aside class="w-64 bg-white p-4 shadow-lg h-full">
      <div class="mb-4">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
  
      <Accordion type="single" collapsible>
        <AccordionItem value="categories">
          <AccordionTrigger>
            Catégories
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              <li><a href="#" class="text-gray-700">Catégorie 1</a></li>
              <li><a href="#" class="text-gray-700">Catégorie 2</a></li>
              <li><a href="#" class="text-gray-700">Catégorie 3</a></li>
            </ul>
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="filter-by-price">
          <AccordionTrigger>
            Filtrer par Prix
          </AccordionTrigger>
          <AccordionContent>
            <input type="range" class="w-full mt-2" min="0" max="100" />
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="alcohol-products">
          <AccordionTrigger>
            Produits Alcoolisés
          </AccordionTrigger>
          <AccordionContent>
            <div class="flex items-center mb-2">
              <input type="checkbox" id="avec-alcool" class="mr-2" />
              <label for="avec-alcool" class="text-gray-700">Avec Alcool</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="sans-alcool" class="mr-2" checked />
              <label for="sans-alcool" class="text-gray-700">Sans Alcool</label>
            </div>
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem value="in-stock">
          <AccordionTrigger>
            En Stock
          </AccordionTrigger>
          <AccordionContent>
            <div class="flex items-center">
              <input type="checkbox" id="en-stock" class="mr-2" />
              <label for="en-stock" class="text-gray-700">En Stock</label>
            </div>
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
  aside {
    width: 16rem;
    background-color: #fff;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: 100vh;
  }
  </style>
  