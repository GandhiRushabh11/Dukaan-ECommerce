const mongoose = require("mongoose");
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String },
    description: String,
    image: String,
    status: { type: Boolean, default: true, required: true },
    slug: { type: String, slug: "name" },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
