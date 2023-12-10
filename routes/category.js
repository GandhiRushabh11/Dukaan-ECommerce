const express = require("express");
const {
  createCategory,
  getCategorios,
  deleteCategory,
  updateCategory,
  getCategory,
  getMyCategorios,
} = require("../controller/category.js");
const Validators = require("../config/validator.js");
const { protect, authorize } = require("../middleware/auth.js");
const router = express.Router();

router
  .get("/all", getCategorios)
  .get("/", protect, authorize("customer"), getMyCategorios)
  .post("/", protect, authorize("admin", "customer"), createCategory);
router
  .route("/:id")
  .put(protect, authorize("admin", "customer"), updateCategory)
  .delete(protect, authorize("admin", "customer"), deleteCategory)
  .get(getCategory);

module.exports = router;
