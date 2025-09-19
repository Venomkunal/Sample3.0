const Category = require('../../models/Category');

exports.createCategory = async (req, res) => {
  try {
    // 🔹 Ensure default "allproducts" exists
    const exists = await Category.findOne({ slug: 'allproducts' });
    if (!exists) {
      await Category.create({
        title: 'AllProducts',
        slug: 'allproducts',
        description: 'Browse all products',
        image: '', // optional
        href: '/categories/allproducts',
        pageheader: 'All Products',
      });
    }

    // 🔹 Create requested category
    const category = new Category(req.body);
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// READ ALL
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
