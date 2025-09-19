const Onsale = require("../../models/onsale-model");
const Product = require("../../models/products-model");
const NewArrival = require("../../models/newarrivals-model");

const durations = {
  never: null,
  '7d': 7,
  '14d': 14,
  '30d': 30,
};

const getOnsale = async (req, res) => {
  try {
    const onsale = await Onsale.find();
    res.json(onsale);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch onsale products' });
  }
};

const addOnsale = async (req, res) => {
  try {
    const { productId, discountPrice, duration } = req.body;

    // 1. Get product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2. Prevent duplicate onsale entry
    const exists = await Onsale.findOne({ title: product.title });
    if (exists) return res.status(400).json({ message: "Already on sale" });

    // 3. Determine discountPrice (from form or fallback to product)
    const finalDiscountPrice = discountPrice || product.discountPrice;
    if (!finalDiscountPrice)
      return res.status(400).json({ message: "No discount price provided and product has none." });

    // 4. Calculate sale end time
    let saleEnd = null;
    if (durations[duration]) {
      saleEnd = new Date();
      saleEnd.setDate(saleEnd.getDate() + durations[duration]);
    }

    // 5. Add onsale category
    const combinedCategory = Array.from(new Set([...(product.category || []), "onsale"]));

    // 6. Create onsale document
    const onsale = new Onsale({
      productId,
      title: product.title,
      name: product.name,
      discountPrice: finalDiscountPrice,
      originalPrice: product.originalPrice,
      category: combinedCategory,
      images: product.images,
      description: product.description,
      inStock: product.inStock,
      onsale: true,
      createdAt: new Date(),
      saleEnd,
    });

    await onsale.save();

    // 7. Update Product and NewArrival collections
    await Product.findByIdAndUpdate(productId, { discountPrice: finalDiscountPrice });
    await NewArrival.updateMany({ title: product.title }, { discountPrice: finalDiscountPrice });

    res.json(onsale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add onsale product" });
  }
};

const updateOnsale = async (req, res) => {
  try {
    const { id } = req.params;
    const { discountPrice, duration } = req.body;

    let saleEnd = null;
    if (durations[duration]) {
      saleEnd = new Date();
      saleEnd.setDate(saleEnd.getDate() + durations[duration]);
    }

    const updated = await Onsale.findByIdAndUpdate(id, { discountPrice, saleEnd }, { new: true });

    if (updated) {
      await Product.updateOne({ title: updated.title }, { discountPrice });
      await NewArrival.updateMany({ title: updated.title }, { discountPrice });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    console.log('hi');
    
    res.status(500).json({ error: 'Failed to update onsale product' });
  }
};

const deleteOnsale = async (req, res) => {
  try {
    const { id } = req.params;
    const onsale = await Onsale.findById(id);
    if (!onsale) return res.status(404).json({ message: 'Not found' });

    // Reset prices in original collections
    await Product.updateOne({ title: onsale.title }, { discountPrice: onsale.originalPrice });
    await NewArrival.updateMany({ title: onsale.title }, { discountPrice: onsale.originalPrice });

    await Onsale.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete onsale product' });
  }
};

// ✅ Cron job/manual cleanup route
const cleanExpiredSales = async (req, res) => {
  try {
    const now = new Date();
    const expired = await Onsale.find({ saleEnd: { $lt: now } });

    for (const item of expired) {
      await Product.updateOne({ title: item.title }, { discountPrice: item.originalPrice });
      await NewArrival.updateMany({ title: item.title }, { discountPrice: item.originalPrice });
      await Onsale.deleteOne({ _id: item._id });
    }

    res.json({ cleaned: expired.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to clean expired onsale products" });
  }
};

module.exports = {
  getOnsale,
  addOnsale,
  updateOnsale,
  deleteOnsale,
  cleanExpiredSales,
};
