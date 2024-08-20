const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  postgresId: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  items: [
    {
      product_id: String,
      quantity: Number,
      price: Number,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('OrderMongo', OrderSchema);
