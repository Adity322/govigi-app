const express = require("express");
const router = express.Router();

const { placeOrder, getOrders } = require("../controllers/orderController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, placeOrder);
router.get("/", protect, getOrders);

const { updateOrderStatus } = require("../controllers/orderController");
router.put("/:id", protect, updateOrderStatus);

module.exports = router;