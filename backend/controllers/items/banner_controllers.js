const Banner = require('../../models/banner-model')
const Product = require('../../models/products-model')

const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
    console.error(Error);
    
  }
};

const addBanners = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // make sure we don't accidentally check wrong field
    const alreadyExists = await Banner.findOne({ productId: product._id });
    if (alreadyExists) {
      return res.status(409).json({ message: 'Product already exists in banner' });
    }

    // ✅ create banner explicitly with productId + product fields
    const bannerProduct = new Banner({
      productId: product._id,
      title: product.title,
      name: product.name || product.title, // fallback if no name field
      discountPrice: product.discountPrice || '',
      originalPrice: product.originalPrice,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      category: product.category,
      images: product.images,
      highlights: product.highlights || [],
      delivery: product.delivery || [],
      seller: product.seller || [],
      description: product.description,
      inStock: product.inStock !== undefined ? product.inStock : true
    });

    await bannerProduct.save();

    res.status(200).json({ message: 'Product added to banner successfully', bannerProduct });
  } catch (err) {
    console.error('Error adding to banner:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const updateBanners = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(banner);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update banner' });
  }
}

const deleteBanners = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete banner' });
  }
}
const Bannerid = async (req, res) => {
  try {
    const product = await Banner.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error1' });
  }
};

module.exports = {
    getBanners,
    addBanners,
    updateBanners,
    deleteBanners,
    Bannerid
};