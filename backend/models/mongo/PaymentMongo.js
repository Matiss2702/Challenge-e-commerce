// models/mongo/PaymentMongo.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
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
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    stripe_payment_intent_id: {
      type: String,
      required: false,
    },
    stripe_checkout_session_id: {
      type: String,
      required: false,
    },
    receipt_url: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentMongo", PaymentSchema);
