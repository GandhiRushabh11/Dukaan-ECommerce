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
const { protect, authorize } = require("../middleware/auth.js");
router.post("/", protect, createOrder);
router.put("/:id", protect, cancelOrder);
router
  .get("/pay/:id", authorize("admin", "user"), pay)
  .get("/allOrders", authorize("admin", "user"), getAllOrders)
  .get("/success", authorize("admin", "user"), verifySuccessPayment)
  .get("/cancel", authorize("admin", "user"), (req, res) => {
    res.send("Your Got Orders Cancelled");
  })
  .get("/:id", protect, authorize("admin", "user"), getMyOrder)
  .get("/", protect, authorize("admin", "user"), getMyOrders);

module.exports = router;
