const express = require("express");
const router = express.Router();
const {
  addToCart,
  getMyCart,
  removeItem,
  decreaseQuantity,
} = require("../controller/cart.js");
const { protect } = require("../middleware/auth.js");
router.post("/addToCart", protect, addToCart);
router.get("/", protect, getMyCart);
router
  .put("/removeItem", protect, removeItem)
  .put("/decreaseQuantity", protect, decreaseQuantity);
module.exports = router;
