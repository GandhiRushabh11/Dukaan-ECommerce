const mongoose = require("mongoose");
const SingleCartItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, default: 1 },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  total: { type: Number, required: true },
  status: { type: Boolean, default: true, required: true },
});

const cartSchema = new mongoose.Schema(
  {
    items: [SingleCartItemSchema],
    totalQty: {
      type: Number,
      default: 0,
      required: true,
    },
    totalCost: {
      type: Number,
      default: 0,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);
