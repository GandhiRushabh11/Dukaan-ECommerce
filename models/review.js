const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: [true, "Please add a text for the review"],
    maxlength: 300,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "product",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("review", ReviewSchema);
