const mongoose = require('mongoose');
const productConnection = require('../utils/productsdb');
const slugify = require('../utils/slugify');
const Category = require('./Category');

const SubcategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  image: String,
  href: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
});

// Auto slug + href
SubcategorySchema.pre("save", async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  const category = await Category.findById(this.parent).lean();
  if (category) {
    this.href = `/categories/${category.slug}/${this.slug}`;
  }
  next();
});

SubcategorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.title && !update.slug) {
    update.slug = slugify(update.title);
  }
  if (update.parent || update.slug) {
    const sub = await this.model.findOne(this.getQuery()).populate("parent");
    if (sub && sub.parent) {
      update.href = `/categories/${sub.parent.slug}/${update.slug || sub.slug}`;
      this.setUpdate(update);
    }
  }
  next();
});

const Subcategory = productConnection.model("Subcategory", SubcategorySchema);
module.exports = Subcategory;
