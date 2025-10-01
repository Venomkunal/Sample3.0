const path = require("path");
const fs = require("fs");
const Banner = require("../../models/banner-model"); // ✅ make sure you have Banner model

// ---------- Helper: get upload folder ----------
const getUploadPath = async () => {
  const folderPath = path.join(__dirname, "../../public/images/banners");

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return folderPath;
};

// ---------- Upload new banner image ----------
const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const bannerId = req.params.id;
    const imagePath = `/images/banners/${req.file.filename}`;

    // Update banner document
    const updatedBanner = await Banner.findByIdAndUpdate(
      bannerId,
      { $push: { images: imagePath } },
      { new: true }
    );

    res.json({ message: "Banner image uploaded", banner: updatedBanner });
  } catch (error) {
    res.status(500).json({ message: "Error uploading banner image", error });
  }
};

// ---------- Update banner image (replace one) ----------
const handleFileUpdate = async (req, res) => {
  try {
    const { id, imgId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Get old image path
    const oldImagePath = banner.images[imgId];
    if (oldImagePath) {
      const absoluteOldPath = path.join(__dirname, "../../public", oldImagePath);
      if (fs.existsSync(absoluteOldPath)) {
        fs.unlinkSync(absoluteOldPath);
      }
    }

    // Replace with new image
    const newImagePath = `/images/banners/${req.file.filename}`;
    banner.images[imgId] = newImagePath;
    await banner.save();

    res.json({ message: "Banner image updated", banner });
  } catch (error) {
    res.status(500).json({ message: "Error updating banner image", error });
  }
};

// ---------- Delete banner image ----------
const handleFileDelete = async (req, res) => {
  try {
    const { id, imgId } = req.params;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Get image to delete
    const imagePath = banner.images[imgId];
    if (imagePath) {
      const absolutePath = path.join(__dirname, "../../public", imagePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }

      banner.images.splice(imgId, 1);
      await banner.save();
    }

    res.json({ message: "Banner image deleted", banner });
  } catch (error) {
    res.status(500).json({ message: "Error deleting banner image", error });
  }
};

module.exports = {
  getUploadPath,
  handleFileUpload,
  handleFileUpdate,
  handleFileDelete,
};
