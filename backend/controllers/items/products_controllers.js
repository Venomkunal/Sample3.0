// backend\controllers\items\products_controllers.js
const Product = require('@models/products-model');
const NewArrival = require('@models/newarrivals-model');
const Onsale = require('@models/onsale-model');
const Banner = require('@models/banner-model');

// GET product by ID
const Productsid = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all products with optional category filtering
const Productsinfo = async (req, res) => {
  try {
    const { category } = req.query;
    let products;

    if (category) {
      // Convert to array if single value
      const categories = Array.isArray(category)
        ? category
        : category.split(',').map(c => c.trim());

      // Exact, case-insensitive match for each category
      const categoryFilters = categories.map(cat => ({
        category: { $regex: `^${cat}$`, $options: 'i' }
      }));

      products = await Product.find({ $or: categoryFilters });
    } else {
      products = await Product.find();
    }

    const formatted = products.map(product => ({
      ...product.toObject(),
      id: product._id.toString(),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// GET new arrivals
const getAllNewArrivals = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: category.toLowerCase() } : {};
    const arrivals = await NewArrival.find(filter);

    const formatted = arrivals.map((product) => ({
      ...product.toObject(),
      id: product._id.toString(),
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching new arrivals:', err);
    res.status(500).json({ error: 'Failed to fetch new arrivals.' });
  }
};

// GET onsale products
const onsale = async (req, res) => {
  try {
    const { category = '' } = req.query;
    const requestedCategories = category
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(Boolean);

    const filter = {
      onsale: true,
      ...(requestedCategories.length > 0 && {
        category: {
          $all: requestedCategories.map(cat => new RegExp(cat, 'i')),
        },
      }),
    };

    const products = await Onsale.find(filter);

    const formatted = products.map((product) => ({
      ...product.toObject(),
      id: product._id.toString(),
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching on-sale products:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ CREATE product and sync with newarrivals
const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    const originalCategories = Array.isArray(productData.category)
      ? productData.category
      : [productData.category];

    const additionalCategories = ['newarrivals', 'categories','allproducts'];
    const mergedCategories = [...new Set([...originalCategories, ...additionalCategories])];

    const newProduct = await Product.create({
      ...productData,
      category: mergedCategories,
    });

    await NewArrival.create({
      ...productData,
      _id: newProduct._id, // same ID to keep sync
      category: mergedCategories,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Product creation failed:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ✅ UPDATE product and newarrivals
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });

    // Also update in NewArrival
    await NewArrival.findByIdAndUpdate(req.params.id, req.body);
    
    // const updatedOnsale = await Onsale.findOneAndUpdate(
    //   { productId: req.params.id },
    //   {
    //     $set: {
    //       description: updatedProduct.description,
    //     },
    //   },
    //   { new: true }
    // );

    // await Banner.findByIdAndUpdate(req.params.id, req.body);

    res.json(updatedProduct);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ DELETE product and newarrivals
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    await NewArrival.findByIdAndDelete(req.params.id);
    await Onsale.deleteMany({ productId: req.params.id });
    await Banner.findByIdAndDelete(req.params.id);

    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Deleted from Product and NewArrival' });
  } catch (err) {
    console.error('Delete failed:', err);
    res.status(400).json({ error: err.message });
  }
};
// Live search (limited fields, for suggestions/autocomplete)
const searchProducts = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const exactMatch   = new RegExp(`^${q}$`, "i"); // exact word
    const startsWith   = new RegExp(`^${q}`, "i");  // starts with query
    const containsWord = new RegExp(q, "i");        // anywhere

    const products = await Product.find({
      $or: [
        { name: exactMatch },
        { category: exactMatch },
        { name: startsWith },
        { category: startsWith },
        { name: containsWord },
        { category: containsWord },
      ]
    })
      .limit(30) // fetch a few more to sort properly
      .select("name images price category");

    // ---- Manual relevance scoring ----
    const scored = products.map(p => {
      const name = (p.name || "").toLowerCase();
      const qLower = q.toLowerCase();

      // Normalize category into a string
      let categoryStr = "";
      if (Array.isArray(p.category)) {
        categoryStr = p.category.join(" ").toLowerCase();
      } else if (typeof p.category === "string") {
        categoryStr = p.category.toLowerCase();
      } else if (p.category && p.category.name) {
        // case: populated category object
        categoryStr = String(p.category.name).toLowerCase();
      }

      let score = 0;
      if (name === qLower || categoryStr === qLower) score = 3; // exact
      else if (name.startsWith(qLower) || categoryStr.startsWith(qLower)) score = 2; // starts with
      else if (name.includes(qLower) || categoryStr.includes(qLower)) score = 1; // contains

      return { ...p.toObject(), score };
    });

    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);

    // Limit final results
    res.json(scored.slice(0, 10));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
};


// Full search (all fields + computed price)
const allsearchProducts = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const exactMatch   = new RegExp(`^${q}$`, "i");
    const startsWith   = new RegExp(`^${q}`, "i");
    const containsWord = new RegExp(q, "i");

    const products = await Product.find({
      $or: [
        { name: exactMatch },
        { category: exactMatch },
        { name: startsWith },
        { category: startsWith },
        { name: containsWord },
        { category: containsWord },
      ]
    });

    const results = products.map((p) => {
      const obj = p.toObject();
      obj.price = p.discountPrice || p.originalPrice;

      const qLower = q.toLowerCase();
      const name = (p.name || "").toLowerCase();

      // normalize category → string
      let categoryStr = "";
      if (Array.isArray(p.category)) {
        categoryStr = p.category.join(" ").toLowerCase();
      } else if (typeof p.category === "string") {
        categoryStr = p.category.toLowerCase();
      } else if (p.category && p.category.name) {
        // case: populated object
        categoryStr = String(p.category.name).toLowerCase();
      }

      // relevance scoring
      let score = 0;
      if (name === qLower || categoryStr === qLower) score = 3; // exact
      else if (name.startsWith(qLower) || categoryStr.startsWith(qLower)) score = 2; // starts with
      else if (name.includes(qLower) || categoryStr.includes(qLower)) score = 1; // contains

      return { ...obj, score };
    });

    results.sort((a, b) => b.score - a.score);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
};



module.exports = {
  Productsid,
  Productsinfo,
  createProduct,
  onsale,
  getAllNewArrivals,
  updateProduct,
  deleteProduct,
  searchProducts,
  allsearchProducts,
};
