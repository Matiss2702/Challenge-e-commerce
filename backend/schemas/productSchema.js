const { z } = require('zod');

const productSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  price: z.number().positive('Le prix doit être positif'),
  category: z.string().optional(),
  brand: z.string().optional(),
  stock: z.number().int().nonnegative('Le stock doit être un entier positif'),
});

module.exports = productSchema;
