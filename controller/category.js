const category = require("../models/category");
const ErrorResponse = require("../utils/errorResponse.js");

exports.createCategory = async (req, res, next) => {
  let createdCategory;
  let { name, description } = req.body;
  try {
    createdCategory = await category.create({
      name,
      description,
      createdBy: req.user,
    });
    res.status(200).json({ success: true, data: createdCategory });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};

exports.getCategorios = async (req, res, next) => {
  let Categorios;
  try {
    Categorios = await category.find();
    res.status(200).json({ success: true, data: Categorios });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};
exports.getCategory = async (req, res, next) => {
  let Category;
  try {
    Category = await category.findById(req.params.id);
    if (!Category)
      return next(
        new ErrorResponse(`No Category with the id of ${req.params.id}`, 404)
      );
    res.status(200).json({ success: true, data: Category });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};
exports.deleteCategory = async (req, res, next) => {
  let categories;
  try {
    categories = await category.findById(req.params.id);
    if (!categories)
      return next(
        new ErrorResponse(`No Category with the id of ${req.params.id}`, 404)
      );
    await categories.deleteOne();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};

exports.updateCategory = async (req, res, next) => {
  let categories;
  try {
    categories = await category.findById(req.params.id);
    if (!categories)
      return next(
        new ErrorResponse(`No Category with the id of ${req.params.id}`, 404)
      );
    categories = await category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};
