const path = require('path');
const fs = require('fs');
const Product = require('../../models/products-model');
const NewArrival = require('@models/newarrivals-model');
const Onsale = require('@models/onsale-model');
const Banner = require('@models/banner-model');
// ------------------------------
// Dynamic upload path generator
// ------------------------------
const getUploadPath = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  // Take first category (if array, else use directly)
  const firstCategory = Array.isArray(product.category)
    ? product.category[0]
    : product.category;

  if (!firstCategory) throw new Error('Product has no category');

  // Clean category and title for safe folder names
  const safeCategory = firstCategory.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const safeTitle = product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  const folderPath = path.join(
    __dirname,
    '../../public/images/products',
    safeCategory,
    safeTitle
  );

  // Ensure folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return folderPath;
};

// ------------------------------
// File Upload
// ------------------------------
const handleFileUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPath = await getUploadPath(req.params.id);

    // Move uploaded files into category/title folder
    const urls = req.files.map((file) => {
      const newPath = path.join(uploadPath, file.originalname);
      fs.renameSync(file.path, newPath);

      // Relative path inside public
      const relativePath = path.relative(
        path.join(__dirname, '..','..', 'public'),
        newPath
      );

      // Public-facing URL stored in DB
      return `/view/${relativePath.replace(/\\/g, '/')}`;
    });

    res.status(200).json({ urls });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Server error during file upload' });
  }
};

// ------------------------------
// File Delete
// ------------------------------
// Delete product images AND product title folder (keep category folder)
const handleFileDelete = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Take first category
    const firstCategory = Array.isArray(product.category)
      ? product.category[0]
      : product.category;

    if (!firstCategory) {
      return res.status(400).json({ message: 'Product has no category' });
    }

    // Safe folder names
    const safeCategory = firstCategory.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const safeTitle = product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Path to the product title folder
    const folderPath = path.join(
      __dirname,
      '../../public/images/products',
      safeCategory,
      safeTitle
    );

    if (fs.existsSync(folderPath)) {
      // Delete product folder and everything inside it
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log('Deleted product folder and images:', folderPath);
    } else {
      console.log('Folder not found:', folderPath);
    }

    // Clear DB image references
    product.images = [];
    await product.save();

    res.status(200).json({ message: 'Product images and title folder deleted' });
  } catch (err) {
    console.error('Error deleting product images:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const handleFileUpdate = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.warn("❌ Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    // ------------------------------
    // Old category + title
    // ------------------------------
    const oldCategories = Array.isArray(product.category)
      ? product.category
      : [product.category];

    const oldSafeCategory = oldCategories[0]
      ? oldCategories[0].replace(/[^a-z0-9]/gi, "_").toLowerCase()
      : null;

    const oldSafeTitle = product.title
      ? product.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()
      : null;

    // ------------------------------
    // New category + title
    // ------------------------------
    const newCategories = Array.isArray(req.body.category)
      ? req.body.category
      : [req.body.category || oldCategories[0]];

    const newSafeCategory = newCategories[0]
      ? newCategories[0].replace(/[^a-z0-9]/gi, "_").toLowerCase()
      : oldSafeCategory;

    const newSafeTitle = req.body.title
      ? req.body.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()
      : oldSafeTitle;

    // ------------------------------
    // Folders
    // ------------------------------
    const baseDir = path.join(__dirname, "../../public/images/products");
    const oldFolder = path.join(baseDir, oldSafeCategory, oldSafeTitle);
    const newFolder = path.join(baseDir, newSafeCategory, newSafeTitle);

    // ------------------------------
    // Rename folder if category/title changed
    // ------------------------------
    if (oldFolder !== newFolder && fs.existsSync(oldFolder)) {
      if (!fs.existsSync(newFolder)) {
        fs.mkdirSync(path.dirname(newFolder), { recursive: true });
        fs.renameSync(oldFolder, newFolder);
        console.log(`✅ Renamed folder:\n${oldFolder}\n→ ${newFolder}`);
      }

      // cleanup old category folder if empty
      const oldCategoryDir = path.dirname(oldFolder);
      if (fs.existsSync(oldCategoryDir)) {
        const remaining = fs.readdirSync(oldCategoryDir);
        if (remaining.length === 0) {
          fs.rmdirSync(oldCategoryDir);
          console.log("🗑 Deleted empty old category folder:", oldCategoryDir);
        }
      }
    }

    // ------------------------------
    // Handle images update
    // ------------------------------
    const oldImages = (product.images || []).map((img) =>
      img.replace(/^\/view\//, "").replace(/^\/+/, "")
    );

    const incomingImages = Array.isArray(req.body.images)
      ? req.body.images
      : [];

    const newImages = incomingImages.map((img) => {
      try {
        const url = new URL(img);
        return url.pathname.replace(/^\/view\//, "").replace(/^\/+/, "");
      } catch {
        return img.replace(/^\/view\//, "").replace(/^\/+/, "");
      }
    });

    // find removed images
    const removedImages = oldImages.filter((img) => !newImages.includes(img));

    for (const img of removedImages) {
      const fullPath = path.resolve(path.join(__dirname, "../../public", img));
      const basePublic = path.resolve(path.join(__dirname, "../../public"));

      if (fullPath.startsWith(basePublic) && fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log("🗑 Deleted removed image:", fullPath);
      } else {
        console.warn("⚠️ File not found for deletion:", fullPath);
      }
    }

    // ------------------------------
    // Rewrite image paths with /view prefix
    // ------------------------------
    let updatedImages = newImages.map(
      (img) => `/view/${img.replace(/^\/+/, "")}`
    );

    if (oldSafeCategory !== newSafeCategory || oldSafeTitle !== newSafeTitle) {
      updatedImages = updatedImages.map((img) =>
        img.replace(
          `/view/images/products/${oldSafeCategory}/${oldSafeTitle}`,
          `/view/images/products/${newSafeCategory}/${newSafeTitle}`
        )
      );
    }

    // ------------------------------
    // Save updated product (Products collection)
    // ------------------------------
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title || product.title,
          category: newCategories, // ✅ always array
          images: updatedImages,
          description: req.body.description ?? product.description,
          price: req.body.price ?? product.price,
        },
      },
      { new: true }
    );

    // ------------------------------
    // Synchronize with NewArrival collection
    // ------------------------------
    const updatedNewArrival = await NewArrival.findOneAndUpdate(
      { _id: req.params.id }, // keep same _id
      {
        $set: {
          title: updatedProduct.title,
          category: updatedProduct.category,
          images: updatedProduct.images,
          description: updatedProduct.description,
          price: updatedProduct.price,
        },
      },
      { new: true }
    );
    const updatedCategories = Array.isArray(updatedProduct.category)
  ? [...new Set([...updatedProduct.category, "onsale"])]
  : [updatedProduct.category, "onsale"];

const updatedOnsale = await Onsale.findOneAndUpdate(
  { productId: req.params.id },
  {
    $set: {
      title: updatedProduct.title,
      category: updatedCategories, // product + onsale category
      images: updatedProduct.images,
      description: updatedProduct.description,
      originalPrice: updatedProduct.price,
      inStock: updatedProduct.inStock,
    },
  },
  { new: true }
);

     const updatedBanner = await Banner.findOneAndUpdate(
      { productId: req.params.id }, // keep same _id
      {
        $set: {
          title: updatedProduct.title,
          category: updatedProduct.category,
          images: updatedProduct.images,
          description: updatedProduct.description,
          price: updatedProduct.price,
        },
      },
      { new: true }
    );
    if (updatedBanner) {
      console.log("✅ Banner synchronized:", updatedBanner._id);
    }
    if (updatedOnsale) {
      console.log("✅ Onsale synchronized:", updatedOnsale._id);
    }

    if (updatedNewArrival) {
      console.log("✅ NewArrival synchronized:", updatedNewArrival._id);
    }

    // ------------------------------
    // Response
    // ------------------------------
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("❌ Error updating product (with rename+cleanup):", err);
    res
      .status(500)
      .json({ message: "Server error during product update", error: err });
  }
};
module.exports = {
  getUploadPath,
  handleFileUpload,
  handleFileDelete,
  handleFileUpdate,
};
