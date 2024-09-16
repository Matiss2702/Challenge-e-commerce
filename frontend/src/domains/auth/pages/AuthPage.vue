<template>
  <div class="flex justify-center">
    <Tabs :defaultValue="currentTab" @value-change="handleTabChange">
      <TabsList>
        <TabsTrigger value="login">Connexion</TabsTrigger>
        <TabsTrigger value="register">Inscription</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <FormComponent
          buttonLabel="Connexion"
          @submit="handleLogin"
        />
      </TabsContent>
      <TabsContent value="register">
        <FormComponent
          :disabled="isSubmitting"
          buttonLabel="Inscription"
          @submit="handleRegister"
        />
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormComponent from '@/domains/auth/components/FormComponent.vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const currentTab = ref(route.params.tab === 'register' ? 'register' : 'login');
const isSubmitting = ref(false);

const handleTabChange = (value: string) => {
  router.replace({ path: `/auth/${value}` });
};

const handleRegister = async (data: any) => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    await authStore.register(data, router);
    console.log('Inscription réussie');
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleLogin = async (data: any) => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    await authStore.login(data, router);
    console.log('Connexion réussie');
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
