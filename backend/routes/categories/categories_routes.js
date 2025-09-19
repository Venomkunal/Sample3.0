const express = require('express')
const Categoryrouter = express.Router();
const Categorycontroller = require('../../controllers/categories/Categorycontroller');
const verify= require('../../middleware/auth-middleware');

Categoryrouter.route('/').get(Categorycontroller.getCategories);
Categoryrouter.route('/me/:slug').get(Categorycontroller.getCategory);
// Categoryrouter.route('/sub:category').get(Categorycontroller.getSubcategories);
// Categoryrouter.route('/paths').get(Categorycontroller.vaild);

Categoryrouter.route('/admin/add').post(verify.requireRole(['admin']),Categorycontroller.createCategory);
Categoryrouter.route('/admin/update/:id').put(verify.requireRole(['admin']),Categorycontroller.updateCategory);
Categoryrouter.route('/admin/delete/:id').delete(verify.requireRole(['admin']),Categorycontroller.deleteCategory);

module.exports = Categoryrouter;