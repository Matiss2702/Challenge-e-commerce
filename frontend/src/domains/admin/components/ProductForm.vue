<template>
  <div class="p-4 bg-white rounded shadow-md">
    <form @submit.prevent="submitForm">
      <!-- Nom du produit -->
      <div class="mb-2">
        <label for="name">Nom du Produit</label>
        <input
          type="text"
          v-model="form.name"
          id="name"
          class="w-full px-2 py-1 border rounded"
          :disabled="isStoreKeeper"
        />
        <p v-if="errors.name" class="text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Description -->
      <div class="mb-2">
        <label for="description">Description</label>
        <textarea
          v-model="form.description"
          id="description"
          class="w-full px-2 py-1 border rounded"
          :disabled="isStoreKeeper"
        ></textarea>
        <p v-if="errors.description" class="text-red-500">{{ errors.description }}</p>
      </div>

      <!-- Prix -->
      <div class="mb-2">
        <label for="price">Prix</label>
        <input
          type="number"
          step="0.01"
          v-model="form.price"
          id="price"
          class="w-full px-2 py-1 border rounded"
          :disabled="isStoreKeeper"
        />
        <p v-if="errors.price" class="text-red-500">{{ errors.price }}</p>
      </div>

      <!-- Catégorie -->
      <div class="mb-2">
        <label for="category">Catégorie</label>
        <input
          type="text"
          v-model="form.category"
          id="category"
          class="w-full px-2 py-1 border rounded"
          :disabled="isStoreKeeper"
        />
        <p v-if="errors.category" class="text-red-500">{{ errors.category }}</p>
      </div>

      <!-- Quantité en stock (toujours modifiable) -->
      <div class="mb-2">
        <label for="stock">Quantité en stock</label>
        <input type="number" v-model="form.stock" id="stock" class="w-full px-2 py-1 border rounded" />
        <p v-if="errors.stock" class="text-red-500">{{ errors.stock }}</p>
      </div>

      <!-- Image (désactivé pour les store keepers) -->
      <div class="mb-2">
        <label for="image">Image</label>
        <input
          type="file"
          @change="handleImageUpload"
          id="image"
          class="w-full px-2 py-1 border rounded"
          :disabled="isStoreKeeper"
        />
        <p v-if="errors.image" class="text-red-500">{{ errors.image }}</p>
      </div>

      <!-- Checkbox pour isAgeRestricted (désactivé pour les store keepers) -->
      <div class="mb-2">
        <input type="checkbox" v-model="form.isAgeRestricted" id="isAgeRestricted" :disabled="isStoreKeeper" />
        <label for="isAgeRestricted" class="ml-2"> Produit restreint aux adultes (18+) ? </label>
      </div>

      <button type="submit" class="px-4 py-2 text-white bg-green-500 rounded">Sauvegarder</button>
      <button type="button" @click="$emit('cancel')" class="px-4 py-2 ml-2 text-black bg-gray-300 rounded">
        Annuler
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";

interface ProductForm {
  id: number | null;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: File | null;
  isAgeRestricted: boolean;
}

interface FormErrors {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  image: string;
}

const props = defineProps<{
  product?: any;
  isEditMode?: boolean;
}>();

const emit = defineEmits(["submit", "cancel"]);

const form = ref<ProductForm>({
  id: null,
  name: "",
  description: "",
  price: 0,
  category: "",
  stock: 0,
  image: null,
  isAgeRestricted: false,
});

const errors = ref<FormErrors>({
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  image: "",
});

const authStore = useAuthStore();
const isStoreKeeper = computed(() => authStore.hasRole("ROLE_STORE_KEEPER"));

// Charger le produit en mode édition
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      form.value = { ...newProduct, image: null };
    }
  },
  { immediate: true }
);

// Gestion de l'upload d'image
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (file) {
    form.value.image = file;
  }
};

// Validation du formulaire
const validateForm = (): boolean => {
  errors.value = {
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  };
  let isValid = true;

  if (!form.value.name || form.value.name.length < 3) {
    errors.value.name = "Le nom doit contenir au moins 3 caractères";
    isValid = false;
  }
  if (!form.value.price || form.value.price <= 0) {
    errors.value.price = "Le prix doit être supérieur à 0";
    isValid = false;
  }
  if (!form.value.image && !props.isEditMode && !isStoreKeeper.value) {
    errors.value.image = "L'image est requise pour la création du produit";
    isValid = false;
  }
  return isValid;
};

// Soumettre le formulaire
const submitForm = () => {
  if (validateForm()) {
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("description", form.value.description);
    formData.append("price", form.value.price.toString());
    formData.append("category", form.value.category);
    formData.append("stock", form.value.stock.toString());
    if (form.value.image) {
      formData.append("image", form.value.image);
    }
    formData.append("isAgeRestricted", form.value.isAgeRestricted ? "true" : "false");
    emit("submit", formData);
  }
};
</script>
