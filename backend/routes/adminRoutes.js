const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/stats", authMiddleware, roleMiddleware("ROLE_ADMIN"), adminController.getStats);

module.exports = router;
