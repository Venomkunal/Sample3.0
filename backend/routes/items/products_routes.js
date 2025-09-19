// backend\routes\items\products_routes.js
const express = require('express')
const productrouter = express.Router();
const productscontroller = require('../../controllers/items/products_controllers');



// productrouter.route('/').post(productscontroller.createProduct);
productrouter.route('/').get(productscontroller.Productsinfo);
productrouter.route('/id/:id').get(productscontroller.Productsid);
productrouter.route('/search').get(productscontroller.searchProducts);
productrouter.route('/search/all').get(productscontroller.allsearchProducts)
productrouter.route('/onsale').get(productscontroller.onsale);
productrouter.route('/newarrivals').get(productscontroller.getAllNewArrivals)
productrouter.route('/newarrivals/:id').get(productscontroller.getAllNewArrivals)
productrouter.route('/admin').get(productscontroller.Productsinfo);
productrouter.route('/admin/add').post(productscontroller.createProduct);
productrouter.route('/admin/update/:id').put(productscontroller.updateProduct);
productrouter.route('/admin/delete/:id').delete(productscontroller.deleteProduct);
productrouter.route('/admin/add').post(productscontroller.createProduct);

module.exports = productrouter;