<template>
  <div class="p-4 bg-white shadow-md rounded">
    <form @submit.prevent="submitForm">
      <div class="mb-2">
        <label for="name">Nom</label>
        <input 
          type="text" 
          v-model="form.name" 
          id="name" 
          class="border rounded px-2 py-1 w-full" 
        />
        <p v-if="errors.name" class="text-red-500">{{ errors.name }}</p>
      </div>

      <div class="mb-2">
        <label for="email">Email</label>
        <input 
          type="email" 
          v-model="form.email" 
          id="email" 
          class="border rounded px-2 py-1 w-full" 
        />
        <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
      </div>

      <div class="mb-2">
        <label for="birthdate">Date de Naissance</label>
        <input 
          type="date" 
          v-model="form.birthdate" 
          id="birthdate" 
          class="border rounded px-2 py-1 w-full" 
        />
        <p v-if="errors.birthdate" class="text-red-500">{{ errors.birthdate }}</p>
      </div>

      <!-- Show the password field only in add mode -->
      <div v-if="!isEditMode" class="mb-2">
        <label for="password">Mot de passe</label>
        <input 
          type="password" 
          v-model="form.password" 
          id="password" 
          class="border rounded px-2 py-1 w-full"
        />
        <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
      </div>

      <!-- Show the reset password checkbox only in edit mode -->
      <div v-if="isEditMode" class="mb-2">
        <input type="checkbox" id="passwordReset" v-model="form.passwordReset" />
        <label for="passwordReset">Envoyer un email pour réinitialiser le mot de passe</label>
      </div>

      <div class="mb-2">
        <label for="role">Rôle</label>
        <select 
          v-model="form.role" 
          id="role" 
          class="border rounded px-2 py-1 w-full"
        >
          <option value="ROLE_USER">Utilisateur</option>
          <option value="ROLE_ADMIN">Administrateur</option>
        </select>
        <p v-if="errors.role" class="text-red-500">{{ errors.role }}</p>
      </div>

      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Sauvegarder</button>
      <button type="button" @click="$emit('cancel')" class="bg-gray-300 text-black px-4 py-2 rounded ml-2">Annuler</button>
    </form>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  user: Object,
  isEditMode: Boolean // Indicates if we're in edit mode or add mode
});

const emit = defineEmits(['submit', 'cancel']);

const form = ref({
  id: null,
  name: '',
  email: '',
  birthdate: '',
  role: 'ROLE_USER',
  password: '', // Password is needed for add mode
  passwordReset: false // Checkbox for resetting password
});

const errors = ref({
  name: '',
  email: '',
  birthdate: '',
  role: '',
  password: ''
});

// Watch the user data to fill the form if we're in edit mode
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      let birthdate = '';
      if (newUser.birthdate && !isNaN(new Date(newUser.birthdate).getTime())) {
        birthdate = new Date(newUser.birthdate).toISOString().split('T')[0];
      }
      form.value = { ...newUser, birthdate, passwordReset: false };
    } else {
      form.value = { id: null, name: '', email: '', birthdate: '', role: 'ROLE_USER', password: '', passwordReset: false };
    }
  },
  { immediate: true }
);

const submitForm = () => {
  if (validateForm()) {
    emit('submit', { ...form.value });
  }
};

const validateForm = () => {
  errors.value = { name: '', email: '', birthdate: '', role: '', password: '' };
  let isValid = true;

  if (!form.value.name || form.value.name.length < 3) {
    errors.value.name = 'Le nom doit contenir au moins 3 caractères';
    isValid = false;
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!form.value.email || !emailRegex.test(form.value.email)) {
    errors.value.email = 'Adresse email invalide';
    isValid = false;
  }

  if (!form.value.birthdate) {
    errors.value.birthdate = 'Veuillez fournir une date de naissance valide';
    isValid = false;
  }

  if (!form.value.role) {
    errors.value.role = 'Veuillez choisir un rôle';
    isValid = false;
  }

  if (!props.isEditMode && (!form.value.password || form.value.password.length < 6)) {
    errors.value.password = 'Le mot de passe doit contenir au moins 6 caractères';
    isValid = false;
  }

  return isValid;
};
</script>
