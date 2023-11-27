const express = require("express");
const {
  addReview,
  deleteReview,
  updateReview,
  getReview,
  getReviews,
} = require("../controller/review.js");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth.js");
router.route("/").post(protect, addReview).get(getReviews);
router
  .route("/:id")
  .put(protect, updateReview)
  .delete(protect, deleteReview)
  .get(getReview);
module.exports = router;
