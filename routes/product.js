const express = require("express");
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProduct,
  uploadProductsImage,
} = require("../controller/product.js");

// Include other resource routers
const reviewRouter = require("../routes/review.js");
const router = express.Router();
const ErrorResponse = require("../utils/errorResponse.js");
const { protect } = require("../middleware/auth.js");
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

router
  .get("/", getProducts)
  .post("/createProduct", protect, createProduct)
  .put("/updateProduct/:id", protect, updateProduct)
  .post(
    "/uploadImage/:id",
    protect,
    upload.array("product_images", 3),
    uploadProductsImage
  )
  .delete("/deleteProduct/:id", protect, deleteProduct)
  .get("/:id", getProduct);
module.exports = router;
