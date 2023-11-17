const { string } = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { generateRandomToken } = require("../utils/common.js");
const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: [true, "Please add a First Name"] },
    lastname: { type: String, required: [true, "Please add a Last Name"] },
    username: {
      type: String,
      unique: true,
      required: [true, "Please add a Username"],
    },
    mobile: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: { type: String, select: false },
    photo: { type: String },
    status: { type: Boolean, default: true },
    emailVerificationStatus: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationTokenCreationTime: { type: Date },
    dateofBirth: { type: Date },
    role: {
      type: String,
      enum: ["user", "customer"],
      default: "user",
    },
    gender: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

//Encrypt paasword Using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const slat = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, slat);
  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Saving Up Token For Email Verification
userSchema.methods.setTokenForVerification = async function () {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.emailVerificationToken = generateRandomToken(verificationToken);

  // Set expire
  this.emailVerificationTokenCreationTime = Date.now() + 10 * 60 * 1000;

  return verificationToken;
};

module.exports = mongoose.model("user", userSchema);
