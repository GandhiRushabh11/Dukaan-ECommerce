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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
// when a product gets deleted we are also deleting all the reviews associated with it, with this pre-hook
productSchema.pre("deleteOne", { document: true }, async function () {
  await this.model("review").deleteMany({ product: this._id });
});
module.exports = mongoose.model("product", productSchema);
