const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShippingDetailSchema = new Schema({
  postgresId: {
    type: String,
    required: true,
    unique: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postal_code: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  shipping_method: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('ShippingDetailMongo', ShippingDetailSchema);
