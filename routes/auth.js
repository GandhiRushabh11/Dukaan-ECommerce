const express = require("express");
const {
  userRegister,
  userlogin,
  sendEmailVerification,
  verifyEmail,
  updatePassword,
  logout,
  getMe,
  verifyRefreshToken,
} = require("../controller/auth.js");
const { protect } = require("../middleware/auth.js");
const router = express.Router();
router
  .post("/register", userRegister)
  .post("/login", userlogin)
  .post("/verificationEmail", protect, sendEmailVerification)
  .post("/refreshToken", verifyRefreshToken);
router.put("/updatePassword", protect, updatePassword);
router
  .get("/verifyEmail/:emailToken", verifyEmail)
  .get("/logout", protect, logout)
  .get("/getMe", protect, getMe);
module.exports = router;
