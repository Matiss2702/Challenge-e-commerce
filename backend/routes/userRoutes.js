const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protéger les routes avec le middleware d'authentification
router.get('/', authMiddleware, getAllUsers);
router.post('/', authMiddleware, createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
