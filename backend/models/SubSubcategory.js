const mongoose = require('mongoose');
const productConnection = require('../utils/categoriesdb');
const slugify = require('../utils/slugify');
const Subcategory = require('./Subcategory');

const SubSubcategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  image: String,
  href: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
});

// Auto slug + href
SubSubcategorySchema.pre("save", async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  const subcategory = await Subcategory.findById(this.parent).populate("parent").lean();
  if (subcategory && subcategory.parent) {
    this.href = `/categories/${subcategory.parent.slug}/${subcategory.slug}/${this.slug}`;
  }
  next();
});

SubSubcategorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.title && !update.slug) {
    update.slug = slugify(update.title);
  }
  if (update.parent || update.slug) {
    const subsub = await this.model.findOne(this.getQuery()).populate({
      path: "parent",
      populate: { path: "parent" }
    });
    if (subsub && subsub.parent && subsub.parent.parent) {
      update.href = `/categories/${subsub.parent.parent.slug}/${subsub.parent.slug}/${update.slug || subsub.slug}`;
      this.setUpdate(update);
    }
  }
  next();
});

const SubSubcategory = productConnection.model("SubSubcategory", SubSubcategorySchema);
module.exports = SubSubcategory;

