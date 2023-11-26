const express = require("express");
const router = express.Router();
const { addToCart, getMyCart, removeItem } = require("../controller/cart.js");
const { protect } = require("../middleware/auth.js");
router.post("/addToCart", protect, addToCart);
router.get("/", protect, getMyCart);
router.put("/removeItem", protect, removeItem);
module.exports = router;
