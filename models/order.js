const mongoose = require("mongoose");
const singleOrderSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, default: 1 },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
});
const orderSchema = mongoose.Schema(
  {
    orderCart: {
      items: [singleOrderSchema],
      subTotal: { type: Number, default: 0, required: true },
      totalQty: {
        type: Number,
        default: 0,
        required: true,
      },
    },
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    address: {
      type: String,
      required: true,
    },
    paymentDetails: {
      paymentId: { type: String },
      paymentState: { type: String, default: "pending" },
      payerInfo: Array,
      token: { type: String },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
