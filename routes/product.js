const express = require("express");
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProduct,
} = require("../controller/product.js");

// Include other resource routers
const reviewRouter = require("../routes/review.js");
const router = express.Router();
const { protect } = require("../middleware/auth.js");

//Re-route into other resource routers
router.use("/:productId/reviews", reviewRouter);

router
  .get("/", getProducts)
  .post("/createProduct", protect, createProduct)
  .put("/updateProduct/:id", protect, updateProduct)
  .delete("/deleteProduct/:id", protect, deleteProduct)
  .get("/:id", getProduct);
module.exports = router;
