const express = require("express");
const router = express.Router();
const { createCheckoutSession, handleWebhook } = require("../controllers/stripeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-checkout-session", authMiddleware, createCheckoutSession);

router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

module.exports = router;
