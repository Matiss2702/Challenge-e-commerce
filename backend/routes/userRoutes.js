const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('ROLE_ADMIN'), userController.getAllUsers);
router.get('/:id', authMiddleware, roleMiddleware('ROLE_ADMIN'), userController.getUserById);
router.post('/', authMiddleware, roleMiddleware('ROLE_ADMIN'), userController.createUser);
router.put('/:id', authMiddleware, roleMiddleware('ROLE_ADMIN'), userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware('ROLE_ADMIN'), userController.deleteUser);

module.exports = router;
