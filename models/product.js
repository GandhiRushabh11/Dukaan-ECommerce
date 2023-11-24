const { number } = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true],
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      required: [true],
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
      type: Number,
      required: [true],
    },
    weight: Number,
    manufacturer: {
      type: String,
    },
    qty: {
      type: Number,
      required: [true],
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
