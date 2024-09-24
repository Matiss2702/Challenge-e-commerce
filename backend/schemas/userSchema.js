const { z } = require('zod');

const userSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  birthdate: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, { message: "La date de naissance n'est pas valide" })
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      return date < today;
    }, { message: "La date de naissance doit être dans le passé" }),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['ROLE_USER', 'ROLE_STORE_KEEPER', 'ROLE_ADMIN', 'ROLE_COMPTA']).optional(),
});

module.exports = userSchema;
