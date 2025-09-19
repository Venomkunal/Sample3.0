const productConnection = require('../utils/productsdb'); // or '@utils/productsdb' if using alias
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  discountPrice: { type: String, default: '' },
  originalPrice: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  category: { type: [String], required: true },
  images: { type: [String], default: [] },
  highlights: { type: [String], default: [] },
  delivery: { type: [String], default: [] },
  seller: { type: [String], default: [] },
  description: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
    // expires: 60 * 60 * 24 * 30
  }
});

// ✅ Register model on productConnection
const Product = productConnection.model('Product', productSchema);

module.exports = Product;


