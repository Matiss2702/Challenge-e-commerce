const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', authMiddleware, productController.getAllProducts);
router.post('/', authMiddleware, roleMiddleware('ROLE_ADMIN'), productController.createProduct);
router.put('/:id', authMiddleware, roleMiddleware('ROLE_ADMIN'), productController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware('ROLE_ADMIN'), productController.deleteProduct);

module.exports = router;
