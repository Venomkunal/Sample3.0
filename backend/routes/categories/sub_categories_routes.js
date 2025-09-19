const express = require('express')
const subCategoryrouter = express.Router();
const subCategorycontroller = require('../../controllers/categories/subCategorycontroller');
const verify = require('../../middleware/auth-middleware');

subCategoryrouter.route('/').get(subCategorycontroller.getSubcategories);
// subCategoryrouter.route('/main:id').get(subCategorycontroller.getSubcategory);

subCategoryrouter.route('/admin/add').post( subCategorycontroller.createSubcategory);
subCategoryrouter.route('/admin/update/:id').put(verify.requireRole(['admin']),subCategorycontroller.updateSubcategory);
subCategoryrouter.route('/admin/delete/:id').delete(verify.requireRole(['admin']),subCategorycontroller.deleteSubcategory);

module.exports = subCategoryrouter;