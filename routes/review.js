const express = require("express");
const { addReview } = require("../controller/review.js");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth.js");

router.post("/", protect, addReview);

module.exports = router;
