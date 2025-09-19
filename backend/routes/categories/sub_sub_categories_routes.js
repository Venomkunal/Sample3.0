const express = require('express')
const subsubCategoryrouter = express.Router();
const subsubCategorycontroller = require('../../controllers/categories/subsubCategorycontroller');
const verify = require('../../middleware/auth-middleware');

subsubCategoryrouter.route('/').get(subsubCategorycontroller.getSubSubcategories);
subsubCategoryrouter.route('/:id').get(subsubCategorycontroller.getSubSubcategory);

subsubCategoryrouter.route('/admin/add').post(verify.requireRole(['admin']), subsubCategorycontroller.createSubSubcategory);
subsubCategoryrouter.route('/admin/update/:id').put(verify.requireRole(['admin']),subsubCategorycontroller.updateSubSubcategory);
subsubCategoryrouter.route('/admin/delete/:id').delete(verify.requireRole(['admin']),subsubCategorycontroller.deleteSubSubcategory);

module.exports = subsubCategoryrouter;