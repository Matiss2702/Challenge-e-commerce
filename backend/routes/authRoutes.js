const express = require("express");
const {
  register,
  login,
  getMe,
  verifyAccount,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/verify-account", verifyAccount);

module.exports = router;
