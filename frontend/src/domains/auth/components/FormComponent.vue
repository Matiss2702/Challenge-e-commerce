<template>
  <form @submit.prevent="handleSubmit" class="max-w-md p-6 mx-auto space-y-4 bg-white rounded-md shadow">
    <!-- CHAMP NOM -->
    <div v-if="isRegister" class="space-y-1">
      <label class="block text-sm font-semibold text-gray-700">Nom</label>
      <input
        v-model="formData.name"
        placeholder="Votre nom"
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
        :class="{ 'border-red-500 ring-red-300': errors.name }"
      />
      <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
    </div>

    <!-- DATE DE NAISSANCE -->
    <div v-if="isRegister" class="space-y-1">
      <label class="block text-sm font-semibold text-gray-700">Date de naissance</label>
      <input
        v-model="formData.birthdate"
        type="date"
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
        :class="{ 'border-red-500 ring-red-300': errors.birthdate }"
      />
      <p v-if="errors.birthdate" class="text-sm text-red-500">{{ errors.birthdate }}</p>
    </div>

    <!-- EMAIL -->
    <div class="space-y-1">
      <label class="block text-sm font-semibold text-gray-700">Email</label>
      <input
        v-model="formData.email"
        type="email"
        placeholder="exemple@mail.com"
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
        :class="{ 'border-red-500 ring-red-300': errors.email }"
      />
      <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
    </div>

    <!-- MOT DE PASSE -->
    <div class="space-y-1">
      <label class="block text-sm font-semibold text-gray-700">Mot de passe</label>
      <input
        v-model="formData.password"
        type="password"
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff9800]"
        :class="{ 'border-red-500 ring-red-300': errors.password }"
      />
      <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
    </div>

    <!-- RGPD -->
    <div v-if="isRegister" class="space-y-1">
      <div class="flex items-center gap-2">
        <input
          id="cgu"
          type="checkbox"
          v-model="formData.acceptRGPD"
          class="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-[#ff9800]"
          :class="{ 'border-red-500 ring-red-300': errors.acceptRGPD }"
        />
        <label for="cgu" class="text-sm text-gray-700">
          J'accepte les
          <RouterLink to="/cgu" class="text-[#ff9800] hover:underline"> Conditions Générales d'Utilisation </RouterLink>
        </label>
      </div>
      <p v-if="errors.acceptRGPD" class="text-sm text-red-500">{{ errors.acceptRGPD }}</p>
    </div>

    <!-- BOUTON -->
    <button
      type="submit"
      class="w-full px-4 py-2 font-semibold text-white bg-[#ff9800] rounded hover:bg-[#e68a00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff9800] disabled:bg-gray-400"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? "Traitement..." : buttonLabel }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import useFormValidation from "@/domains/auth/composables/useFormValidations";

const props = defineProps<{
  isRegister: boolean;
  buttonLabel: string;
}>();

const emit = defineEmits<{
  (e: "submit", data: any): void;
}>();

const { errors, validateForm } = useFormValidation();
const isSubmitting = ref(false);

const formData = ref({
  name: "",
  birthdate: "",
  email: "",
  password: "",
  acceptRGPD: false,
});

const handleSubmit = async () => {
  const isValid = validateForm(formData.value, props.isRegister);

  if (!isValid) return;

  isSubmitting.value = true;
  try {
    await emit("submit", formData.value);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
