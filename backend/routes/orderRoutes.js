const express = require('express');
const { getAllOrders, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protéger les routes avec le middleware d'authentification
router.get('/', authMiddleware, getAllOrders);
router.post('/', authMiddleware, createOrder);
router.put('/:id', authMiddleware, updateOrder);
router.delete('/:id', authMiddleware, deleteOrder);

module.exports = router;
