const { z } = require('zod');

const userSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['ROLE_USER', 'ROLE_STORE_KEEPER', 'ROLE_ADMIN', 'ROLE_COMPTA']).optional(),
});

module.exports = userSchema;
