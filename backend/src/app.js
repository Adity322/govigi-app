const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware FIRST
app.use(cors());
app.use(express.json());  // 🔥 THIS FIXES YOUR ERROR

// ✅ Routes AFTER middleware
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const protect = require("./middleware/authMiddleware");

app.get("/api/test", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

//For Product
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

//For Order
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;