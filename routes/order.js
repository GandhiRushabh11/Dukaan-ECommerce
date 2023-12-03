const express = require("express");
const router = express.Router();
const { createOrder } = require("../controller/order.js");
const { protect } = require("../middleware/auth.js");
router.post("/", protect, createOrder);
router.get("/", (req, res) => {
  res.send("Testsing");
});
module.exports = router;
