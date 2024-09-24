<template>
  <div class="p-4 bg-white shadow-md rounded">
    <form @submit.prevent="submitForm">
      <div class="mb-2">
        <label for="name">Nom du Produit</label>
        <input 
          type="text" 
          v-model="form.name" 
          id="name" 
          class="border rounded px-2 py-1 w-full" 
        />
        <p v-if="errors.name" class="text-red-500">{{ errors.name }}</p>
      </div>

      <div class="mb-2">
        <label for="description">Description</label>
        <textarea 
          v-model="form.description" 
          id="description" 
          class="border rounded px-2 py-1 w-full" 
        ></textarea>
        <p v-if="errors.description" class="text-red-500">{{ errors.description }}</p>
      </div>

      <div class="mb-2">
        <label for="price">Prix</label>
        <input 
          type="number" 
          v-model="form.price" 
          id="price" 
          class="border rounded px-2 py-1 w-full" 
        />
        <p v-if="errors.price" class="text-red-500">{{ errors.price }}</p>
      </div>

      <div class="mb-2">
        <label for="category">Catégorie</label>
        <input 
          type="text" 
          v-model="form.category" 
          id="category" 
          class="border rounded px-2 py-1 w-full" 
        />
        <p v-if="errors.category" class="text-red-500">{{ errors.category }}</p>
      </div>

      <div class="mb-2">
        <label for="stock">Quantité en stock</label>
        <input 
          type="number" 
          v-model="form.stock" 
          id="stock" 
          class="border rounded px-2 py-1 w-full" 
        />
        <p v-if="errors.stock" class="text-red-500">{{ errors.stock }}</p>
      </div>

      <div class="mb-2">
        <label for="image">Image</label>
        <input 
          type="file" 
          @change="handleImageUpload" 
          id="image" 
          class="border rounded px-2 py-1 w-full"
        />
        <p v-if="errors.image" class="text-red-500">{{ errors.image }}</p>
      </div>

      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Sauvegarder</button>
      <button type="button" @click="$emit('cancel')" class="bg-gray-300 text-black px-4 py-2 rounded ml-2">Annuler</button>
    </form>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  product: Object,
  isEditMode: Boolean
});

const emit = defineEmits(['submit', 'cancel']);

const form = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
  image: null
});

const errors = ref({
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  image: ''
});

watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      form.value = { ...newProduct, image: null };
    }
  },
  { immediate: true }
);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.image = file;
  }
};

const validateForm = () => {
  errors.value = { name: '', description: '', price: '', category: '', stock: '', image: '' };
  let isValid = true;

  if (!form.value.name || form.value.name.length < 3) {
    errors.value.name = 'Le nom doit contenir au moins 3 caractères';
    isValid = false;
  }

  if (!form.value.price || form.value.price <= 0) {
    errors.value.price = 'Le prix doit être supérieur à 0';
    isValid = false;
  }

  if (!form.value.image && !props.isEditMode) {
    errors.value.image = 'L\'image est requise pour la création du produit';
    isValid = false;
  }

  return isValid;
};

const submitForm = () => {
  if (validateForm()) {
    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('description', form.value.description);
    formData.append('price', form.value.price.toString());
    formData.append('category', form.value.category);
    formData.append('stock', form.value.stock.toString());

    if (form.value.image) {
      formData.append('image', form.value.image);
    }

    emit('submit', formData);
  }
};

</script>
