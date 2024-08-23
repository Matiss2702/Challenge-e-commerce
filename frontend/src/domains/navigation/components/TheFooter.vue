<script setup lang="ts">
import { routerPageName } from '../../../router/routePageName';


const {
	// HOME,
} = routerPageName;
</script>

<template>
	<footer class="py-10 lg:py-16 bg-whiteless">
		<div>
			<div class="container flex flex-col lg:flex-row gap-16 lg:gap-0 justify-between">
				<div class="flex flex-col gap-6">
					<!-- <RouterLink
						:to="{ name: HOME }"
						class="text-2xl font-bold"
					>
						MET
					</RouterLink> -->

					<!-- <p>{{ $t("layout.default.footer.slogan") }}</p> -->
				</div>	
					
			</div>

			<div class="container">
				<hr class="h-px my-6 border-0 bg-black opacity-10">

				<!-- <span class="opacity-60">Mon Énorme Tronc &#169; 2024-{{ currentYear }}. {{ $t("layout.default.footer.copyrights") }}</span> -->
			</div>
		</div>
	</footer>
</template>