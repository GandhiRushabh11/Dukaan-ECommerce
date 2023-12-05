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
  uploadProfilePicture,
} = require("../controller/auth.js");
const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user._id;
    const path = `./uploads/user/${userId}`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: function (req, file, cb) {
    let filename = Date.now() + "_" + file.originalname.toLowerCase();
    cb(null, filename.replace(/ +/g, ""));
  },
  onError: function (err, next) {
    console.log("error", err);
    return next(new ErrorResponse(err, 500));
  },
});
const upload = multer({ storage: storage });
const { protect } = require("../middleware/auth.js");
const router = express.Router();
router
  .post("/register", userRegister)
  .post("/login", userlogin)
  .post("/verificationEmail", protect, sendEmailVerification)
  .post("/refreshToken", verifyRefreshToken);
router
  .put("/updatePassword", protect, updatePassword)
  .put(
    "/uploadProfileImage",
    protect,
    upload.single("profileImage"),
    uploadProfilePicture
  );
router
  .get("/verifyEmail/:emailToken", verifyEmail)
  .get("/logout", protect, logout)
  .get("/getMe", protect, getMe);
module.exports = router;
