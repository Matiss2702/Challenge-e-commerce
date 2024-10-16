const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  postgresId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  imagePath: {
    type: String,
    required: false,
  },
  isAgeRestricted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('ProductMongo', ProductSchema);
