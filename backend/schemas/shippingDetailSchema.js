const { z } = require('zod');

const shippingDetailSchema = z.object({
  order_id: z.string(),
  address: z.string(),
  city: z.string(),
  postal_code: z.string(),
  country: z.string(),
  shipping_method: z.string().optional(),
});

module.exports = shippingDetailSchema;
