const express = require("express");
const {
  createCategory,
  getCategorios,
  deleteCategory,
  updateCategory,
  getCategory,
} = require("../controller/category.js");
const Validators = require("../config/validator.js");
const { protect, authorize } = require("../middleware/auth.js");
const router = express.Router();
router
  .route("/categories")
  .get(getCategorios)
  .post(protect, authorize("admin", "customer"), createCategory);
router
  .route("/categories/:id")
  .put(protect, authorize("admin", "customer"), updateCategory)
  .delete(protect, authorize("admin", "customer"), deleteCategory)
  .get(authorize("admin", "customer", "user"), getCategory);
/* router.get("*", (req, res) => {
  res.send("Not found");
}); */
module.exports = router;
