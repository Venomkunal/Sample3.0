const express = require('express');
const onsalerouter = express.Router();
const OnsaleController = require('../../controllers/items/onsale_controller');

onsalerouter.route('/').get(OnsaleController.getOnsale);
onsalerouter.route('/add').post(OnsaleController.addOnsale);
onsalerouter.route('/update/:id').put(OnsaleController.updateOnsale);
onsalerouter.route('/delete/:id').delete(OnsaleController.deleteOnsale);


module.exports = onsalerouter;