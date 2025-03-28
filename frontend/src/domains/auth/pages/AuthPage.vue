<template>
  <div class="flex justify-center">
    <div class="w-full max-w-md">
      <div class="flex border-b">
        <button
          @click="currentTab = 'login'"
          class="px-4 py-2 font-medium"
          :class="{ 'border-b-2 border-blue-500 text-blue-600': currentTab === 'login' }"
        >
          Connexion
        </button>
        <button
          @click="currentTab = 'register'"
          class="px-4 py-2 font-medium"
          :class="{ 'border-b-2 border-blue-500 text-blue-600': currentTab === 'register' }"
        >
          Inscription
        </button>
      </div>

      <div v-if="currentTab === 'login'" class="mt-4">
        <FormComponent buttonLabel="Connexion" :isRegister="false" @submit="handleLogin" />
        <div class="mt-2 text-center">
          <RouterLink to="/request-reset-password" class="text-[#ff9800] hover:underline">
            Mot de passe oublié ?
          </RouterLink>
        </div>
      </div>

      <div v-if="currentTab === 'register'" class="mt-4">
        <FormComponent buttonLabel="Inscription" :isRegister="true" @submit="handleRegister" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import FormComponent from "@/domains/auth/components/FormComponent.vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const router = useRouter();
const currentTab = ref("login");

const handleRegister = async (data: any) => {
  try {
    await authStore.register(data);
    router.push("/");
  } catch (error) {
    console.error("Registration error:", error);
  }
};

const handleLogin = async (data: any) => {
  try {
    await authStore.login(data);
    router.push("/");
  } catch (error) {
    console.error("Login error:", error);
  }
};
</script>
