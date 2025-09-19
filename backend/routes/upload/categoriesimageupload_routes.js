const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  uploadImages,
  getImages,
  updateImage,
  deleteImage
} = require('../../controllers/upload/categoriesimageuploadcontrollers');

const categoriesrouter = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const endpoint = req.params.endpoint;
    const uploadDir = path.join(__dirname, '../../public/images', endpoint);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const upload = multer({ storage });

// CRUD
categoriesrouter.post('/create/:endpoint', upload.array('images'), uploadImages);   // Create
categoriesrouter.get('/get/:endpoint', getImages);                              // Read
categoriesrouter.put('/updateimg/:endpoint/:filename', upload.single('image'), updateImage); // Update
categoriesrouter.delete('/deleteimg/:endpoint/:filename', deleteImage);               // Delete

module.exports = categoriesrouter;
