const express = require('express');
const { getAllPayments, createPayment, updatePayment, deletePayment } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protéger les routes avec le middleware d'authentification
router.get('/', authMiddleware, getAllPayments);
router.post('/', authMiddleware, createPayment);
router.put('/:id', authMiddleware, updatePayment);
router.delete('/:id', authMiddleware, deletePayment);

module.exports = router;
