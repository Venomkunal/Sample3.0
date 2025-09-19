const express = require("express");
const categoryPathsRoutes = express.Router();
const { valid } = require("../../controllers/categories/categoryPathsController");

// GET /api/paths
categoryPathsRoutes.get("/", valid);

module.exports = categoryPathsRoutes;
