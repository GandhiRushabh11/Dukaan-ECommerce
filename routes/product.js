const express = require("express");
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProduct,
  uploadProductsImage,
  getMyProducts,
} = require("../controller/product.js");

// Include other resource routers
const reviewRouter = require("../routes/review.js");
const orderRouter = require("../routes/order.js");
const router = express.Router();
const ErrorResponse = require("../utils/errorResponse.js");
const { protect, authorize } = require("../middleware/auth.js");
const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const ProductId = req.params.id;
    const path = `./uploads/Products/${ProductId}`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (req, file, cb) {
    let filename = Date.now() + "_" + file.originalname.toLowerCase();
    cb(null, filename.replace(/ +/g, ""));
  },
  onError: function (err, next) {
    console.log("error", err);
    return next(new ErrorResponse("Cheking", 500));
  },
});
const upload = multer({ storage: storage });
//Re-route into other resource routers
router.use("/:productId/reviews", reviewRouter);
router.use("/:productId/order", orderRouter);
router
  .get("/", protect, authorize("admin", "customer"), getMyProducts)
  .get("/all", getProducts)
  .post(
    "/createProduct",
    protect,
    authorize("admin", "customer"),
    createProduct
  )
  .put(
    "/updateProduct/:id",
    protect,
    authorize("admin", "customer"),
    updateProduct
  )
  .post(
    "/uploadImage/:id",
    protect,
    authorize("admin", "customer"),
    upload.array("product_images", 3),
    uploadProductsImage
  )
  .delete(
    "/deleteProduct/:id",
    protect,
    authorize("admin", "customer"),
    deleteProduct
  )
  .get("/:id", getProduct);
module.exports = router;
