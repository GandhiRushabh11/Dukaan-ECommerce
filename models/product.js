const { number } = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please add a name for the product"],
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please add a description for the product"],
    },
    imagesPath: {
      type: Array,
    },
    status: {
      type: Boolean,
      default: true,
    },
    sku: {
      type: String,
      unique: true,
    },
    price: {
      type: number,
      required: [true, "Please add a price for the product"],
    },
    weight: number,
    manufacturer: {
      type: String,
    },
    qty: {
      type: number,
      required: [true, "Please add a quantity for the product"],
      default: 1,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    category_id: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("product", productSchema);
