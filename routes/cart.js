const express = require("express");
const router = express.Router();
const { addToCart, getMyCart } = require("../controller/cart.js");
const { protect } = require("../middleware/auth.js");
router.post("/addToCart", protect, addToCart);
router.get("/", protect, getMyCart);
module.exports = router;
