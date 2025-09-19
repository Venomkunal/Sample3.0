const mongoose = require('mongoose');
const productConnection = require('../utils/productsdb');

const bannerSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    // unique: true,
  },
  bannertitle: { type: String, default: '' },
  title: { type: String, required: true },
  name: { type: String, required: true },
  discountPrice: { type: String, default: ''},
  originalPrice: { type: String, required: true },
  category: { type: [String], required: true }, 
  images: { type:[String],default: [] },
  description: { type: String,required: true },
});

const Banner = productConnection.model('Banner', bannerSchema);

module.exports = Banner;

