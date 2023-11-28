const crypto = require("crypto");
const Product = require("../models/product");
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");

exports.createProduct = asyncHandler(async (req, res, next) => {
  let {
    name,
    description,
    status,
    price,
    weight,
    qty,
    visibility,
    category_id,
  } = req.body;
  try {
    let sku = crypto.randomBytes(16).toString("hex");
    if (!req.user) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
    const product = await Product.create({
      name,
      description,
      status,
      sku,
      price,
      weight,
      qty,
      visibility,
      category_id,
      createdBy: req.user,
    });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!req.user) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
    if (!product) {
      return next(
        new ErrorResponse(`No Product with the id of ${req.params.id}`, 404)
      );
    }
    if (!(product.createdBy._id.toString() === req.user._id.toString())) {
      return next(
        new ErrorResponse(`Not authorized to delete this Product`, 400)
      );
    }
    await product.deleteOne();
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let {
    name,
    description,
    status,
    price,
    weight,
    qty,
    visibility,
    category_id,
  } = req.body;
  try {
    let product = await Product.findById(req.params.id);
    const fieldToUpdate = {
      name,
      description,
      status,
      price,
      weight,
      qty,
      visibility,
      category_id,
    };
    if (!req.user) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
    if (!product) {
      return next(
        new ErrorResponse(`No Product with the id of ${req.params.id}`, 404)
      );
    }
    if (!(product.createdBy._id.toString() === req.user._id.toString())) {
      return next(
        new ErrorResponse(`Not authorized to update this Product`, 400)
      );
    }

    product = await product.updateOne(fieldToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!req.user) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
    if (!product) {
      return next(
        new ErrorResponse(`No Product with the id of ${req.params.id}`, 404)
      );
    }
    if (!(product.createdBy._id.toString() === req.user._id.toString())) {
      return next(
        new ErrorResponse(`Not authorized to delete this Product`, 400)
      );
    }
    await product.deleteOne();
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
exports.getProducts = asyncHandler(async (req, res, next) => {
  try {
    let product = await Product.find();
    res
      .status(200)
      .json({ success: true, total: product.length, data: product });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
exports.getProduct = asyncHandler(async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(
        new ErrorResponse(`No Product with the id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
