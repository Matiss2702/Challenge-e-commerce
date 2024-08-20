const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  postgresId: {
    type: String,
    required: true,
    unique: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('PaymentMongo', PaymentSchema);
