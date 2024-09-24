const { z } = require('zod');

const productSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  description: z.string().optional(),
  price: z.number().positive({ message: 'Price must be a positive number' }),
  category: z.string().optional(),
  stock: z.number().nonnegative({ message: 'Stock must be a non-negative number' }),
});

module.exports = productSchema;
