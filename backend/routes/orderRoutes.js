const express = require("express");
const {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrdersController,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("ROLE_ADMIN"), getAllOrders);
router.post("/", authMiddleware, roleMiddleware("ROLE_ADMIN"), createOrder);
router.put("/:id", authMiddleware, roleMiddleware("ROLE_ADMIN"), updateOrder);
router.delete("/:id", authMiddleware, roleMiddleware("ROLE_ADMIN"), deleteOrder);
router.get("/my-orders", authMiddleware, getUserOrdersController);

module.exports = router;
