const { z } = require('zod');

const orderSchema = z.object({
  user_id: z.string(),
  total_amount: z.number().positive('Le montant total doit être positif'),
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
  items: z.array(z.object({
    product_id: z.string(),
    quantity: z.number().int().positive('La quantité doit être un entier positif'),
    price: z.number().positive('Le prix doit être positif'),
  })).optional(),
});

module.exports = orderSchema;
