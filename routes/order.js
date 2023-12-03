const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getMyOrder,
  getAllOrders,
  cancelOrder,
  pay,
  verifySuccessPayment,
} = require("../controller/order.js");
const { protect } = require("../middleware/auth.js");
router.post("/", protect, createOrder);
router.put("/:id", protect, cancelOrder);
router
  .get("/pay/:id", pay)
  .get("/allOrders", getAllOrders)
  .get("/success", verifySuccessPayment)
  .get("/cancel", (req, res) => {
    res.send("Your Got Orders Cancelled");
  })
  .get("/:id", protect, getMyOrder)
  .get("/", protect, getMyOrders);

module.exports = router;
