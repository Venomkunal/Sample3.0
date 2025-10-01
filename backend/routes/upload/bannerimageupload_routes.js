const express = require("express");
const multer = require("multer");
const path = require("path");
const uploadController = require("../../controllers/upload/bannerimageuploadcontroller");

const router = express.Router();

// ---------- Multer Storage ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    (async () => {
      try {
        const folderPath = await uploadController.getUploadPath();
        cb(null, folderPath);
      } catch (err) {
        cb(err, null);
      }
    })();
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// ---------- Routes ----------
router.post("/upload/:id", upload.single("file"), uploadController.handleFileUpload);
router.put("/update/:id/:imgId", upload.single("file"), uploadController.handleFileUpdate);
router.delete("/delete/:id/:imgId", uploadController.handleFileDelete);

module.exports = router;
