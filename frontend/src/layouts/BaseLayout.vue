<script setup lang="ts">
import TheHeader from "../domains/navigation/components/TheHeader.vue";
import TheFooter from "../domains/navigation/components/TheFooter.vue";

</script>

<template>
	<TheHeader />

	<main>
		<RouterView />
	</main>

	<TheFooter />
</template>