const express = require('express');
const { getAllShippingDetails, createShippingDetail, updateShippingDetail, deleteShippingDetail } = require('../controllers/shippingDetailController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('ROLE_ADMIN'), getAllShippingDetails);
router.post('/', authMiddleware, roleMiddleware('ROLE_ADMIN'), createShippingDetail);
router.put('/:id', authMiddleware, roleMiddleware('ROLE_ADMIN'), updateShippingDetail);
router.delete('/:id', authMiddleware, roleMiddleware('ROLE_ADMIN'), deleteShippingDetail);

module.exports = router;
