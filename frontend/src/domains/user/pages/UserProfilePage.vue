<template>
  <div>
    <h1>Profile</h1>
    <div v-if="user">
      <p>Nom: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
      <button @click="handleLogout">Déconnexion</button>
    </div>
    <div v-else>
      <p>Chargement des informations...</p>
    </div>

    <Carousel>
      <CarouselContent>
        <CarouselItem>Slide 1 Content</CarouselItem>
        <CarouselItem>Slide 2 Content</CarouselItem>
        <CarouselItem>Slide 3 Content</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const user = ref(authStore.user);

onMounted(async () => {
  if (!user.value) {
    try {
      await authStore.fetchUser();
      user.value = authStore.user;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
    }
  }
});

const handleLogout = () => {
  authStore.logout(router);
};
</script>
