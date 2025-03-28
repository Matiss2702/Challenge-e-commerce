<template>
  <footer class="bg-gradient-to-r from-[#FACF39] via-[#FBB040] to-[#FACF39] text-white py-8 mt-3">
    <div class="container flex flex-col items-start justify-between gap-20 px-4 mx-auto md:flex-row md:items-center">
      <div class="flex flex-col items-start justify-center">
        <div class="flex items-center mb-4">
          <img src="@/assets/logo-footer.svg" alt="Logo Troupicool" class="h-6 mr-2" />
          <h3 class="text-lg font-bold">Troupicool</h3>
        </div>
        <p class="mb-2">Explorez l'univers rafraîchissant de nos boissons tropicales.</p>
        <p class="mb-2">Ce site interdit la vente de boissons alcoolisées aux mineurs.</p>
        <p>Contact : team.troupicool@outlook.fr</p>
      </div>

      <div class="flex flex-col items-start justify-center">
        <h3 class="mb-4 font-bold">Pages</h3>
        <div class="grid grid-cols-2 gap-x-4">
          <ul>
            <li class="mb-2"><router-link to="/" class="hover:underline">Accueil</router-link></li>
            <li class="mb-2"><router-link to="/products" class="hover:underline">Produits</router-link></li>
            <li class="mb-2"><router-link to="/categories" class="hover:underline">Catégories</router-link></li>
          </ul>
          <ul>
            <li class="mb-2"><router-link to="/about" class="hover:underline">À propos</router-link></li>
            <li class="mb-2"><router-link to="/contact" class="hover:underline">Contact</router-link></li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col items-start justify-center">
        <h3 class="mb-4 font-bold">Divers</h3>
        <ul>
          <li class="mb-2">
            <router-link to="/privacy-policy" class="hover:underline">Politique de confidentialité</router-link>
          </li>
          <li class="mb-2">
            <router-link to="/cgu" class="hover:underline">Conditions Générales d'Utilisation</router-link>
          </li>
          <li class="mb-2">
            <router-link to="/legal-info" class="hover:underline"
              >Informations légales sur la vente d'alcool</router-link
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="pt-4 mt-8 text-sm text-center border-t border-white">© 2024 Troupicool. Tous droits réservés.</div>
  </footer>
</template>

<script setup></script>

<style scoped>
.bg-gradient-to-r {
  background: linear-gradient(to right, #facf39 0%, #fbb040 25%, #fbb040 75%, #facf39 100%);
}
</style>
