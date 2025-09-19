// models/NewArrival.js
const mongoose = require('mongoose');
const productConnection = require('../utils/productsdb');

const newArrivalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  discountPrice: { type: String, default: ''},
  originalPrice: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  category: { type: [String], required: true },
  images: { type:[String],default: [] },
  highlights: { type: [String], default: [] },  // optional
  delivery: { type: [String], default: [] },    // optional
  seller: { type: [String], default: [] },      // optional
  description: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30 // TTL: 30 days
  }
});

const NewArrival = productConnection.model('NewArrival', newArrivalSchema);

module.exports = NewArrival;
