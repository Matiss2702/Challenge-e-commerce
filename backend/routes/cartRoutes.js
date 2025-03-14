const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/get-or-create", authMiddleware, cartController.getOrCreateCart);
router.get("/", authMiddleware, cartController.getCart);
router.post("/items", authMiddleware, cartController.addItemToCart);
router.patch("/items/:itemId", authMiddleware, cartController.updateCartItem);
router.delete("/items/:itemId", authMiddleware, cartController.removeCartItem);
router.delete("/clear", authMiddleware, cartController.clearCart);

module.exports = router;
