require("dotenv").config();
require('module-alias/register');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const productConnection = require('@utils/productsdb');
const productrouter = require('@routes/items/products_routes');
const categoryRoutes = require('@routes/categories/categories_routes');
const subCategoryrouter = require('@routes/categories/sub_categories_routes');
const subsubCategoryrouter = require('@routes/categories/sub_sub_categories_routes');
const categoryPathsRoutes = require('@routes/categories/categoryPathsRoutes.js');
const bannerrouter = require('@routes/items/banner_routes');
const onsalerouter = require('@routes/items/onsale_routes');

const app = express();
const PORT = process.env.APIPORT || 5001;

const allowedOrigins = [
  process.env.CUSTOMER_SITE_URL,
  process.env.ADMIN_PANEL_URL,
];
console.log('CUSTOMER_SITE_URL:', process.env.CUSTOMER_SITE_URL);
console.log('ADMIN_PANEL_URL:', process.env.ADMIN_PANEL_URL);

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

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/products", productrouter);
app.use("/categories", categoryRoutes);
app.use("/subcategories", subCategoryrouter);
app.use("/subsubcategories", subsubCategoryrouter);
app.use("/paths", categoryPathsRoutes);
app.use("/banner", bannerrouter);
app.use("/onsale", onsalerouter);

app.get("/", (req, res) => {
  res.send("Hello, api server is working");
});


// ✅ Wait for DB connection before starting server
productConnection.once('open', () => {
  console.log('✅ Product database connected');

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on API port ${PORT}`);
  });
});

// ❌ Log error if connection fails
productConnection.on('error', (err) => {
  console.error('❌ Failed to connect to product database:', err);
  process.exit(1);
});

module.exports = app;
