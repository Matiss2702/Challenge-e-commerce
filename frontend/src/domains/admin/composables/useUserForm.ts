// composables/useUserForm.ts
import { ref, watch } from "vue";

export function useUserForm(props: { user: any; isEditMode: boolean }) {
  const form = ref({
    id: null,
    name: "",
    email: "",
    birthdate: "",
    role: "ROLE_USER",
    password: "",
    passwordReset: false,
  });

  const errors = ref({
    name: "",
    email: "",
    birthdate: "",
    role: "",
    password: "",
  });

  watch(
    () => props.user,
    (newUser) => {
      if (newUser) {
        let birthdate = "";
        if (newUser.birthdate && !isNaN(new Date(newUser.birthdate).getTime())) {
          birthdate = new Date(newUser.birthdate).toISOString().split("T")[0];
        }
        form.value = { ...newUser, birthdate, passwordReset: false };
      } else {
        resetForm();
      }
    },
    { immediate: true }
  );

  const resetForm = () => {
    form.value = {
      id: null,
      name: "",
      email: "",
      birthdate: "",
      role: "ROLE_USER",
      password: "",
      passwordReset: false,
    };
  };

  const validateForm = () => {
    errors.value = { name: "", email: "", birthdate: "", role: "", password: "" };
    let isValid = true;

    if (!form.value.name || form.value.name.length < 3) {
      errors.value.name = "Le nom doit contenir au moins 3 caractères";
      isValid = false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!form.value.email || !emailRegex.test(form.value.email)) {
      errors.value.email = "Adresse email invalide";
      isValid = false;
    }

    if (!form.value.birthdate) {
      errors.value.birthdate = "Veuillez fournir une date de naissance valide";
      isValid = false;
    }

    if (!form.value.role) {
      errors.value.role = "Veuillez choisir un rôle";
      isValid = false;
    }

    if (!props.isEditMode && (!form.value.password || form.value.password.length < 6)) {
      errors.value.password = "Le mot de passe doit contenir au moins 6 caractères";
      isValid = false;
    }

    return isValid;
  };

  return {
    form,
    errors,
    validateForm,
    resetForm,
  };
}
