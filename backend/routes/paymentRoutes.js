const express = require('express');
const { getAllPayments, createPayment, updatePayment, deletePayment } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('ROLE_ADMIN'), getAllPayments);
router.post('/', authMiddleware, roleMiddleware('ROLE_ADMIN'), createPayment);
router.put('/:id', authMiddleware, roleMiddleware('ROLE_ADMIN'), updatePayment);
router.delete('/:id', authMiddleware, roleMiddleware('ROLE_ADMIN'), deletePayment);

module.exports = router;
