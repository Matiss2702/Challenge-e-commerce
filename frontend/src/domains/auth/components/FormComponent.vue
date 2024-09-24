<template>
  <form @submit.prevent="handleSubmit">
    <div v-if="isRegister">
      <input v-model="formData.name" type="text" placeholder="Nom" required class="border p-2 rounded mb-2" />
      <p v-if="errors.name" class="text-red-500">{{ errors.name }}</p>
    </div>
    <div v-if="isRegister">
      <input v-model="formData.birthdate" type="date" placeholder="Date de naissance" required class="border p-2 rounded mb-2" />
      <p v-if="errors.birthdate" class="text-red-500">{{ errors.birthdate }}</p>
    </div>
    <div>
      <input v-model="formData.email" type="email" placeholder="Email" required class="border p-2 rounded mb-2" />
      <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
    </div>
    <div class="relative">
      <input :type="passwordFieldType" v-model="formData.password" placeholder="Mot de passe" required class="border p-2 rounded mb-2 w-full pr-10" />
      <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
      <button type="button" @click="togglePasswordVisibility" class="absolute right-3 top-2">
        <span v-if="isPasswordVisible">👁️</span>
        <span v-else>🙈</span>
      </button>
    </div>

    <div class="flex items-center mb-2">
      <input v-model="formData.acceptRGPD" type="checkbox" required class="mr-2" />
      <label for="acceptRGPD" class="text-sm">J'accepte les conditions RGPD</label>
      <p v-if="errors.acceptRGPD" class="text-red-500">{{ errors.acceptRGPD }}</p>
    </div>
    <button type="submit" :disabled="!formData.acceptRGPD" class="bg-green-500 text-white px-4 py-2 rounded">
      {{ buttonLabel }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import useFormValidation from '@/domains/auth/composables/useFormValidations';

const props = defineProps({
  buttonLabel: String,
  onSubmit: Function,
  isRegister: Boolean
});

const emits = defineEmits(['submit']);

const formData = ref({
  name: '',
  birthdate: '',
  email: '',
  password: '',
  acceptRGPD: false
});

const { errors, validateForm } = useFormValidation(formData, props.isRegister);

const isPasswordVisible = ref(false);
const passwordFieldType = computed(() => (isPasswordVisible.value ? 'text' : 'password'));

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const handleSubmit = () => {
  if (validateForm()) {
    emits('submit', formData.value);
    props.onSubmit && props.onSubmit(formData.value);
  }
};
</script>
