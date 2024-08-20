const { z } = require('zod');

const paymentSchema = z.object({
  order_id: z.string(),
  amount: z.number().positive('Le montant doit être positif'),
  payment_method: z.string(),
  status: z.enum(['pending', 'completed', 'failed']),
});

module.exports = paymentSchema;
