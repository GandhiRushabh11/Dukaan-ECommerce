const crypto = require("crypto");
const Product = require("../models/product");
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const fs = require("node:fs");
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
      user: req.user,
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
    if (!(product.user._id.toString() === req.user._id.toString())) {
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
    if (!(product.user._id.toString() === req.user._id.toString())) {
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
    if (!(product.user._id.toString() === req.user._id.toString())) {
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

exports.uploadProductsImage = async (req, res, next) => {
  try {
    let user = req.user;
    let product = await Product.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
    if (!product) {
      return next(
        new ErrorResponse(`No Product with the id of ${req.params.id}`, 404)
      );
    }
    if (!(product.user._id.toString() === user._id.toString())) {
      return next(
        new ErrorResponse(
          `Not authorized to Upload Images for this Product`,
          400
        )
      );
    }
    const images = req.files;
    if (Array.isArray(images) && !images.length) {
      return next(new ErrorResponse("Please Provide Product Images", 400));
    }
    const imagesArray = images.map(
      (image) => image.destination + "/" + image.filename
    );

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { imagesPath: imagesArray },
      {
        new: true,
        runValidators: true,
      }
    );
    /* //Pushing Images Path Array in To DB
    product.imagesPath.push(ImagesArray);
    product.save(); */
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};

exports.getMyProducts = asyncHandler(async (req, res, next) => {
  try {
    let user = req.user;
    let product = await Product.find({ user });
    res
      .status(200)
      .json({ success: true, total: product.length, data: product });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
exports.getProductVideos = async (req, res, next) => {
  const range = req.headers.range;
  const videoPath = "./public/uploads/products/test.mkv";
  const videoSize = fs.statSync(videoPath).size;
  if (range) {
    const chunkSize = 1 * 1e6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const stream = fs.createReadStream(videoPath, { start, end });
    stream.pipe(res);
  }
};
