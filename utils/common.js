const crypto = require("crypto");
exports.generateRandomToken = function (verificationToken) {
  // Hash token and set to resetPasswordToken field
  const verificationHashToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  return verificationHashToken;
};
