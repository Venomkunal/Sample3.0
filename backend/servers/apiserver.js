require("dotenv").config();
require("module-alias/register");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// DB connections
const productConnection = require("@utils/productsdb");
const categoriesConnection = require("@utils/categoriesdb");

// Routes
const productrouter = require("@routes/items/products_routes");
const categoryRoutes = require("@routes/categories/categories_routes");
const subCategoryrouter = require("@routes/categories/sub_categories_routes");
const subsubCategoryrouter = require("@routes/categories/sub_sub_categories_routes");
const categoryPathsRoutes = require("@routes/categories/categoryPathsRoutes.js");
const bannerrouter = require("@routes/items/banner_routes");
const onsalerouter = require("@routes/items/onsale_routes");

const app = express();
const PORT = process.env.APIPORT || 5001;

/* ---------------- CORS ---------------- */
const allowedOrigins = [
  process.env.CUSTOMER_SITE_URL,
  process.env.ADMIN_PANEL_URL,
  process.env.TEST_URL,
];
console.log("CUSTOMER_SITE_URL:", process.env.CUSTOMER_SITE_URL);
console.log("ADMIN_PANEL_URL:", process.env.ADMIN_PANEL_URL);
console.log("TEST_URL:",process.env.TEST_URL);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS not allowed for origin:", origin);
      callback(new Error("CORS not allowed", origin));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

/* ---------------- ROUTES ---------------- */
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

/* ---------------- DB CONNECTION + SERVER ---------------- */
Promise.all([
  new Promise((resolve, reject) => {
    productConnection.once("open", () => {
      console.log("✅ Product database connected");
      resolve();
    });
    productConnection.on("error", (err) => reject(err));
  }),
  new Promise((resolve, reject) => {
    categoriesConnection.once("open", () => {
      console.log("✅ Categories database connected");
      resolve();
    });
    categoriesConnection.on("error", (err) => reject(err));
  }),
])
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on API port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database(s):", err);
    process.exit(1);
  });

module.exports = app;

