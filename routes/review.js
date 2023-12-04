const express = require("express");
const {
  addReview,
  deleteReview,
  updateReview,
  getReview,
  getReviews,
} = require("../controller/review.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth.js");
router
  .route("/")
  .post(protect, authorize("admin", "user"), addReview)
  .get(getReviews);
router
  .route("/:id")
  .put(protect, authorize("admin", "user"), updateReview)
  .delete(protect, authorize("admin", "user", "customer"), deleteReview)
  .get(getReview);
module.exports = router;
