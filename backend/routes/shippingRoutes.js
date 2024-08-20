const express = require('express');
const { getAllShippingDetails, createShippingDetail, updateShippingDetail, deleteShippingDetail } = require('../controllers/shippingDetailController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protéger les routes avec le middleware d'authentification
router.get('/', authMiddleware, getAllShippingDetails);
router.post('/', authMiddleware, createShippingDetail);
router.put('/:id', authMiddleware, updateShippingDetail);
router.delete('/:id', authMiddleware, deleteShippingDetail);

module.exports = router;
