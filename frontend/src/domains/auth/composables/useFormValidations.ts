import { ref } from "vue";

export default function useFormValidation() {
  const errors = ref<{ [key: string]: string }>({});

  const validateForm = (formData: any, isRegister: boolean) => {
    errors.value = {};

    // Validation email
    if (!formData.email) {
      errors.value.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.value.email = "L'email n'est pas valide.";
    }

    // Validation mot de passe
    if (!formData.password) {
      errors.value.password = "Le mot de passe est requis.";
    } else if (formData.password.length < 6) {
      errors.value.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }

    // Validation champs spécifiques à l'inscription
    if (isRegister) {
      if (!formData.name) {
        errors.value.name = "Le nom est requis.";
      } else if (formData.name.length < 2) {
        errors.value.name = "Le nom doit contenir au moins 2 caractères.";
      }

      if (!formData.birthdate) {
        errors.value.birthdate = "La date de naissance est requise.";
      }

      if (!formData.acceptRGPD) {
        errors.value.acceptRGPD = "Vous devez accepter les conditions RGPD.";
      }
    }

    return Object.keys(errors.value).length === 0;
  };

  return {
    errors,
    validateForm,
  };
}
