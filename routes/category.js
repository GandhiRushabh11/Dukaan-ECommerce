const express = require("express");
const {
  createCategory,
  getCategorios,
  deleteCategory,
  updateCategory,
  getCategory,
} = require("../controller/category.js");
const Validators = require("../config/validator.js");
const { protect } = require("../middleware/auth.js");
const router = express.Router();
router.route("/categories").get(getCategorios).post(protect, createCategory);
router
  .route("/categories/:id")
  .put(protect, updateCategory)
  .delete(protect, deleteCategory)
  .get(getCategory);
/* router.get("*", (req, res) => {
  res.send("Not found");
}); */
module.exports = router;
