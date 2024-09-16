<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input v-model="formData.name" type="text" placeholder="Nom" required class="border p-2 rounded mb-2" />
      <p v-if="errors.name" class="text-red-500">{{ errors.name }}</p>
    </div>
    <div>
      <input v-model="formData.email" type="email" placeholder="Email" required class="border p-2 rounded mb-2" />
      <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
    </div>
    <div>
      <input v-model="formData.password" type="password" placeholder="Mot de passe" required class="border p-2 rounded mb-2" />
      <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
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
import { ref, defineProps, defineEmits } from 'vue';
import useFormValidation from '@/domains/auth/composables/useFormValidations';

const props = defineProps({
  buttonLabel: String,
  onSubmit: Function
});

const emits = defineEmits(['submit']);

const formData = ref({
  name: '',
  email: '',
  password: '',
  acceptRGPD: false
});

const { errors, validateForm } = useFormValidation(formData);

const handleSubmit = () => {
  if (validateForm()) {
    emits('submit', formData.value);
    props.onSubmit && props.onSubmit(formData.value);
  }
};
</script>
