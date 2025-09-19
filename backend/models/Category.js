const mongoose = require('mongoose');
const productConnection = require('../utils/productsdb');
const slugify = require('../utils/slugify');

const CategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  image: String,
  href: String,
  pageheader: String,
});

// Auto slug + href
CategorySchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  this.href = `/categories/${this.slug}`;
  next();
});

CategorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.title && !update.slug) {
    update.slug = slugify(update.title);
    update.href = `/categories/${update.slug}`;
    this.setUpdate(update);
  }
  next();
});

const Category = productConnection.model("Category", CategorySchema);
module.exports = Category;

