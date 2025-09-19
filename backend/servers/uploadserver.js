require("dotenv").config();
require('module-alias/register');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const uploadRoute = require('@routes/upload/productimageupload_routes');
const categoriesrouter= require('../routes/upload/categoriesimageupload_routes');
const productConnection = require('@utils/productsdb'); // NOT a function!

const app = express();
const PORT = process.env.UPLOADPORT || 5000;

const allowedOrigins = [
  process.env.CUSTOMER_SITE_URL,
  process.env.ADMIN_PANEL_URL,
];
// console.log('CUSTOMER_SITE_URL:', process.env.CUSTOMER_SITE_URL);
// console.log('ADMIN_PANEL_URL:', process.env.ADMIN_PANEL_URL);


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200 
};

// ✅ Static file serving
app.use('/view/images', express.static(path.join(__dirname, '../public/images')));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// ✅ Upload routes
app.use('/uploads', uploadRoute);
app.use('/cuploads', categoriesrouter);

app.get("/", (req, res) => {
  res.send("Hello, upload server is working");
});

// ✅ Wait for DB before listening
productConnection.once('open', () => {
  console.log('✅ Product DB connected (Upload Server)');

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on upload port ${PORT}`);
  });
});

productConnection.on('error', (err) => {
  console.error('❌ Failed to connect to Product DB (Upload Server):', err);
  process.exit(1);
});

module.exports = app;
