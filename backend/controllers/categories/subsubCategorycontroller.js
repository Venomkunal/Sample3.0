const SubSubcategory = require('../../models/SubSubcategory');

// CREATE
exports.createSubSubcategory = async (req, res) => {
  try {
    const subsub = new SubSubcategory(req.body);
    await subsub.save();
    res.status(201).json(subsub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getSubSubcategories = async (req, res) => {
  try {
    const subsubs = await SubSubcategory.find().populate({
      path: "parent",
      populate: { path: "parent" }
    });
    res.json(subsubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getSubSubcategory = async (req, res) => {
  try {
    const subsub = await SubSubcategory.findById(req.params.id).populate({
      path: "parent",
      populate: { path: "parent" }
    });
    if (!subsub) return res.status(404).json({ error: "SubSubcategory not found" });
    res.json(subsub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateSubSubcategory = async (req, res) => {
  try {
    const subsub = await SubSubcategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subsub) return res.status(404).json({ error: "SubSubcategory not found" });
    res.json(subsub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteSubSubcategory = async (req, res) => {
  try {
    const subsub = await SubSubcategory.findByIdAndDelete(req.params.id);
    if (!subsub) return res.status(404).json({ error: "SubSubcategory not found" });
    res.json({ message: "SubSubcategory deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
