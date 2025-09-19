const fs = require('fs');
const path = require('path');

// ✅ CREATE (Upload)
exports.uploadImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const endpoint = req.params.endpoint;
  const urls = req.files.map(f => `/view/images/${endpoint}/${f.filename}`);
  res.json({ urls });
};

// ✅ READ (List all)
exports.getImages = (req, res) => {
  const endpoint = req.params.endpoint;
  const dirPath = path.join(__dirname, '../../public/images', endpoint);

  if (!fs.existsSync(dirPath)) return res.json({ urls: [] });

  const files = fs.readdirSync(dirPath);
  const urls = files.map(f => `/view/images/${endpoint}/${f}`);
  res.json({ urls });
};

// ✅ UPDATE (Replace)
exports.updateImage = (req, res) => {
  const endpoint = req.params.endpoint;
  const oldName = req.params.filename;
  const dirPath = path.join(__dirname, '../../public/images', endpoint);

  const oldPath = path.join(dirPath, oldName);
  if (!fs.existsSync(oldPath)) {
    return res.status(404).json({ message: 'Image not found' });
  }
  if (!req.file) return res.status(400).json({ message: 'No new file uploaded' });

  const newUrl = `/view/images/${endpoint}/${req.file.filename}`;
  fs.unlinkSync(oldPath); // remove old file

  res.json({ url: newUrl });
};

// ✅ DELETE
exports.deleteImage = (req, res) => {
  const endpoint = req.params.endpoint;
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../public/images', endpoint, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Image not found' });
  }

  fs.unlinkSync(filePath);
  res.json({ message: 'Image deleted successfully' });
};
