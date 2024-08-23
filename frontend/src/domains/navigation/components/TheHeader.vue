
<script setup lang="ts">
// import { routerPageName } from "../../../router/routePageName";
// import TheNavbar from "./TheNavbar.vue";
// import TheSearch from "./TheSearch.vue";

// const HOME = routerPageNameeName;
// const userStore = useUserStore();
// const { items } = useGetNavigationBar();
</script>

<template>
	<header class="sticky top-0 z-10 w-full bg-white shadow-md">
		<div class="container flex items-center h-24 gap-4">
			<!-- <MobileNavbar :navigation-items="items" /> -->

			<div class="flex items-center justify-between flex-1 gap-10 md:justify-center">
				<!-- <RouterLink
					:to="{ name: HOME }"
					class="text-2xl font-bold"
				>
				</RouterLink> -->

				<NotificationsDropdown />

				<AccountDropdown />
			</div>
		</div>
	</header>
</template>
