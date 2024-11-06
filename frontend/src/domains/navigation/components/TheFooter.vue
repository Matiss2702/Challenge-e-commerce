<template>
	<footer class="bg-gradient-to-r from-[#FACF39] via-[#FBB040] to-[#FACF39] text-white py-8 mt-3">
	  <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-20">
		<div class="flex flex-col justify-center items-start">
		  <div class="flex items-center mb-4">
			<img src="@/assets/logo-footer.svg" alt="Logo Troupicool" class="h-6 mr-2" />
			<h3 class="text-lg font-bold">Troupicool</h3>
		  </div>
		  <p class="mb-2">
			Explorez l'univers rafraîchissant de nos boissons tropicales.
		  </p>
		  <p class="mb-2">
			Ce site interdit la vente de boissons alcoolisées aux mineurs.
		  </p>
		  <p>Contact : team.troupicool@outlook.fr</p>
		</div>
  
		<div class="flex flex-col justify-center items-start">
		  <h3 class="font-bold mb-4">Pages</h3>
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
  
		<div class="flex flex-col justify-center items-start">
		  <h3 class="font-bold mb-4">Divers</h3>
		  <ul>
			<li class="mb-2"><router-link to="/privacy-policy" class="hover:underline">Politique de confidentialité</router-link></li>
			<li class="mb-2"><router-link to="/terms" class="hover:underline">Conditions Générales d'Utilisation</router-link></li>
			<li class="mb-2"><router-link to="/legal-info" class="hover:underline">Informations légales sur la vente d'alcool</router-link></li>
		  </ul>
		</div>
	  </div>
	  <div class="border-t border-white mt-8 pt-4 text-center text-sm">
		© 2024 Troupicool. Tous droits réservés.
	  </div>
	</footer>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .bg-gradient-to-r {
	background: linear-gradient(to right, #FACF39 0%, #FBB040 25%, #FBB040 75%, #FACF39 100%);
  }
  </style>
  