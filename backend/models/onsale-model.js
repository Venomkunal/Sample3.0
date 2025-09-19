// models/Onsale.js
const mongoose = require('mongoose');
const productConnection = require('../utils/productsdb');



const onsaleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    // unique: true,
  },
  title: String,
  name: String,
  discountPrice: String,
  originalPrice: String,
  category: [String],
  images: [String],
  description: String,
  inStock: Boolean,
  onsale: { type: Boolean, default: true },
  saleEnd: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7, // ⏱️ TTL: 7 days
  },
});

onsaleSchema.index({ saleEnd: 1 }, { expireAfterSeconds: 0 });

const Onsale = productConnection.model('Onsale', onsaleSchema);


module.exports = Onsale;