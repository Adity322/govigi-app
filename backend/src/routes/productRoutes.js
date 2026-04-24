const express = require("express");
const router = express.Router();
const { getProducts } = require("../controllers/productController");

router.get("/", getProducts); // public route

module.exports = router;