import { ref } from 'vue';

export default function useFormValidation(formData: any) {
  const errors = ref<{ [key: string]: string }>({});

  const validateForm = () => {
    errors.value = {};

    if (!formData.value.name) {
      errors.value.name = 'Le nom est requis.';
    }

    if (!formData.value.email) {
      errors.value.email = 'L\'email est requis.';
    } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
      errors.value.email = 'L\'email n\'est pas valide.';
    }

    if (!formData.value.password) {
      errors.value.password = 'Le mot de passe est requis.';
    } else if (formData.value.password.length < 6) {
      errors.value.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    }

    if (!formData.value.acceptRGPD) {
      errors.value.acceptRGPD = 'Vous devez accepter les conditions RGPD.';
    }

    return Object.keys(errors.value).length === 0;
  };

  return {
    errors,
    validateForm
  };
}
