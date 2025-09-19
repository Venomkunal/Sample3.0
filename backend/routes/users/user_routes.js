const express = require('express');
const usersrouter = express.Router();
const userController = require('../../controllers/users/user_controllers');
const { requireRole } = require('../../middleware/auth-middleware');
const verify = require('../../middleware/verify');

// 🧑‍💼 Get logged-in admin details (self)
usersrouter.get('/me', verify.verifyToken,userController.getme);

// 🔐 Admin-only: manage users
usersrouter.get('/admin/me',requireRole(['admin']),userController.getme);
usersrouter.get('/admin', requireRole(['admin']), userController.getAllUsers);
usersrouter.get('/admin/:id', requireRole(['admin']), userController.getUserById);
usersrouter.put('/admin/:id', requireRole(['admin']), userController.updateUser);
usersrouter.delete('/admin/:id', requireRole(['admin']), userController.deleteUser);

module.exports = usersrouter;

