const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protéger les routes avec le middleware d'authentification
router.get('/', authMiddleware, getAllProducts);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
