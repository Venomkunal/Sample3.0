const express = require('express');
const bannerrouter = express.Router();
const bannerController = require('../../controllers/items/banner_controllers');

bannerrouter.route('/').get(bannerController.getBanners);
bannerrouter.route('/:id').get(bannerController.Bannerid);
bannerrouter.route('/add').post(bannerController.addBanners);
bannerrouter.route('/:id').put(bannerController.updateBanners);
bannerrouter.route('/:id').delete(bannerController.deleteBanners);


module.exports = bannerrouter;