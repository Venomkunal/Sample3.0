const Category = require('../../models/Category');
const Subcategory = require('../../models/Subcategory');
const SubSubcategory = require('../../models/SubSubcategory');

const valid = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const paths = [];

    for (const cat of categories) {
      // main category
      paths.push(["categories", cat.slug]);

      // get subcategories
      const subcategories = await Subcategory.find({ parent: cat._id }).lean();

      for (const sub of subcategories) {
        // category/subcategory
        paths.push(["categories", cat.slug, sub.slug]);

        // get sub-subcategories
        const subsubs = await SubSubcategory.find({ parent: sub._id }).lean();

        for (const subsub of subsubs) {
          // category/subcategory/subsubcategory
          paths.push(["categories", cat.slug, sub.slug, subsub.slug]);
        }
      }
    }

    res.json(paths);
  } catch (err) {
    console.error("❌ Error fetching slugs", err);
    res.status(500).json({ error: "Failed to fetch category slugs" });
  }
};

module.exports = { valid };
