// backend\routes\upload\productimageupload_routes.js
const express = require('express');
const multer = require('multer');
const uploadController = require('../../controllers/upload/ProductsimageuploadController');

const uploadrouter = express.Router();

// Multer storage with dynamic destination
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      let folderPath;

      if (req.params.id) {
        // If product ID is passed
        folderPath = await uploadController.getUploadPath(req.params.id);
        // const result = await uploadController.getUploadPath(req.params.id);
        // folderPath = result.folderPath;
      } else {
        // Default fallback folder
        folderPath = path.join(__dirname, '../../public/images/');
      }

      cb(null, folderPath);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});


const upload = multer({ storage });

// Routes
// Upload images → requires product ID in URL
uploadrouter.post(
  '/:id/images',
  upload.array('images', 10),
  uploadController.handleFileUpload
);

// Update product images
uploadrouter.put('/edit/:id', uploadController.handleFileUpdate);

// Delete product images
uploadrouter.delete('/delete/:id', uploadController.handleFileDelete);

module.exports = uploadrouter;
