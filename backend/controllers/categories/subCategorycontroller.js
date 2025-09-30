const Subcategory = require('../../models/Subcategory');
const Category = require('../../models/Category');

// CREATE
exports.createSubcategory = async (req, res) => {
  try {
    const subcategory = new Subcategory(req.body);
    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL (with optional parent filter)
exports.getSubcategories = async (req, res) => {
  try {
    const { parent } = req.query;
    let query = {};

    if (parent) {
      // Find the category by slug to get its ObjectId
      const category = await Category.findOne({ slug: parent });
      if (!category) {
        return res.status(404).json({ error: "Parent category not found" });
      }
      query.parent = category._id;
    }

    const subcategories = await Subcategory.find(query).populate("parent");
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// READ ONE
exports.getSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({ slug: req.params.slug });
    if (!subcategory) return res.status(404).json({ error: "Subcategory not found" });
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subcategory) return res.status(404).json({ error: "Subcategory not found" });
    res.json(subcategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) return res.status(404).json({ error: "Subcategory not found" });
    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
