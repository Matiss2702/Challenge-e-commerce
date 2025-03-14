const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartItemSchema = new Schema(
  {
    postgresId: {
      type: String,
      required: true,
      unique: true,
    },
    cart_id: { type: String, required: true },
    product_id: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CartItemMongo", CartItemSchema);
