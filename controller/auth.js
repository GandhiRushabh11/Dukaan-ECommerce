const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/async.js");
const user = require("../models/user.js");
const { generateRandomToken } = require("../utils/common.js");
const ErrorResponse = require("../utils/errorResponse.js");
const sendEmail = require("../utils/sendEmail.js");

exports.userRegister = asyncHandler(async (req, res, next) => {
  let createdUser;
  let {
    firstname,
    lastname,
    username,
    mobile,
    email,
    password,
    photo,
    status,
    dateofBirth,
    gender,
    address,
  } = req.body;

  try {
    createdUser = await user.create({
      firstname,
      lastname,
      username,
      mobile,
      email,
      password,
      photo,
      status,
      dateofBirth,
      gender,
      address,
    });
    res.status(200).json({ success: true, data: createdUser });
    //sendTokenResponse(createdUser, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
exports.userlogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const userData = await user.findOne({ email }).select("+password");

  if (!userData) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await userData.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  if (!userData.emailVerificationStatus === true) {
    return next(new ErrorResponse("Please verify your email Id.", 401));
  }
  //Create Token
  sendTokenResponse(userData, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      access_token: token,
      refresh_token: refreshToken,
    });
};

exports.sendEmailVerification = asyncHandler(async function (req, res, next) {
  let user = req.user;
  if (!user) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  if (user.emailVerificationStatus === true && user.emailVerificationStatus) {
    return next(
      new ErrorResponse("your email is already verified with the system", 200)
    );
  } else {
    // Get email token
    const emailToken = await user.setTokenForVerification();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/verifyEmail/${emailToken}`;

    const message = `Dear ${
      user.firstname + " " + user.lastname
    },Thank you for signing up with Dukaan Ecommerce. To complete your registration, please use link below to verify your email address:${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Email Verification - Dukaan Ecommerce",
        message,
      });

      res.status(200).json({ success: true, data: "Email sent", emailToken });
    } catch (err) {
      user.emailVerificationToken = undefined;
      user.emailVerificationTokenCreationTime = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  }
});
exports.verifyEmail = asyncHandler(async function (req, res, next) {
  // Get hashed token
  const emailToken = generateRandomToken(req.params.emailToken);
  const userData = await user.findOne({
    emailVerificationToken: emailToken,
    emailVerificationTokenCreationTime: { $gt: Date.now() },
  });
  if (!userData) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  // Set Email Verification to true

  userData.emailVerificationStatus = true;
  userData.emailVerificationToken = undefined;
  userData.emailVerificationTokenCreationTime = undefined;
  await userData.save();

  const message = `Your email address has been successfully verified. You can now access all the features and services of Dukaan Ecommerce. Thank you for joining us`;

  try {
    await sendEmail({
      email: userData.email,
      subject: "Dukaan Ecommerce - Email Verified",
      message,
    });

    res.status(200).json({
      success: true,
      data: "Email sent",
      VerificationStatus: userData.emailVerificationStatus,
    });
  } catch (err) {
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const userData = await user.findById(req.user.id).select("+password");

  // Check current password
  if (!(await userData.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  userData.password = req.body.newPassword;
  await userData.save();

  sendTokenResponse(userData, 200, res);
});

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = ({
    firstname,
    lastname,
    username,
    mobile,
    dateofBirth,
    gender,
    address,
  } = req.body);
  try {
    const userData = await user.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.verifyRefreshToken = asyncHandler(async (req, res, next) => {
  let token = req.body.refreshToken;
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    let decodedUser = await user.findById(decoded.id);
    sendTokenResponse(decodedUser, 200, res);
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
