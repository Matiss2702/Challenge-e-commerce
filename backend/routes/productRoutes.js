const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// Routes
router.get('/', authMiddleware, productController.getAllProducts);
router.get('/:id', authMiddleware, productController.getProductById);
router.post('/', authMiddleware, roleMiddleware('ROLE_ADMIN'), upload.single('image'), productController.createProduct);
router.put('/:id', authMiddleware, roleMiddleware('ROLE_ADMIN'), upload.single('image'), productController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware('ROLE_ADMIN'), productController.deleteProduct);

module.exports = router;
