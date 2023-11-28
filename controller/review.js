const asyncHandler = require("../middleware/async.js");
const Product = require("../models/product.js");
const Review = require("../models/review.js");
const ErrorResponse = require("../utils/errorResponse.js");

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.productId) {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate({
      path: "product",
      select: "name description",
    });
    if (!reviews)
      return next(
        new ErrorResponse(
          `No review found with the id of ${req.params.id}`,
          404
        )
      );
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    const reviews = await Review.find();
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  }
});
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "product",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});
exports.addReview = asyncHandler(async (req, res, next) => {
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
});
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  review.save();

  res.status(200).json({
    success: true,
    data: review,
  });
});
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
