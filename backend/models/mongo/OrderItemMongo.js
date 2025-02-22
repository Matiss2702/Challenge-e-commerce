const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema(
  {
    postgresId: {
      type: String,
      required: true,
      unique: true,
    },
    order_id: { type: String, required: true },
    product_id: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", OrderItemSchema);
