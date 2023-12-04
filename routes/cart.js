const express = require("express");
const router = express.Router();
const {
  addToCart,
  getMyCart,
  removeItem,
  decreaseQuantity,
} = require("../controller/cart.js");
const { protect, authorize } = require("../middleware/auth.js");
router.post("/addToCart", protect, authorize("admin", "user"), addToCart);
router.get("/", protect, authorize("admin", "user"), getMyCart);
router
  .put("/removeItem", protect, authorize("admin", "user"), removeItem)
  .put(
    "/decreaseQuantity",
    protect,
    authorize("admin", "user"),
    decreaseQuantity
  );
module.exports = router;
