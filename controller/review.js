const Product = require("../models/product.js");
const Review = require("../models/review.js");
const ErrorResponse = require("../utils/errorResponse.js");

exports.addReview = async (req, res, next) => {
  let { text, rating } = req.body;
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(
      new ErrorResponse(
        `No Product with the id of ${req.params.productId}`,
        404
      )
    );
  }

  const review = await Review.create({
    text,
    rating,
    product: req.params.productId,
    user: req.user,
  });

  res.status(201).json({
    success: true,
    data: review,
  });
};
