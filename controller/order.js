const Cart = require("../models/cart.js");
const Order = require("../models/order.js");
const asyncHandler = require("../middleware/async.js");
const ErrorResponse = require("../utils/errorResponse.js");

exports.createOrder = asyncHandler(async (req, res, next) => {
  let user = req.user;
  let orderCart;
  let singleItem = [];
  let subTotal = 0;
  try {
    let cart = await Cart.findOne({ user });

    const { tax, shippingFee, address } = req.body;

    if (!cart.items || cart.items.length < 1) {
      return next(new ErrorResponse(`No cart Items provided`, 400));
    }

    if (!tax || !shippingFee) {
      return next(
        new ErrorResponse(`Please provided tax and shipping fee`, 400)
      );
    }

    for (const item of cart.items) {
      if (item.status) {
        subTotal += item.total;
        singleItem.push(item);
      }
    }
    orderCart = {
      items: [...singleItem],
      totalQty: singleItem.length,
      subTotal,
    };

    let total = Number.parseInt(subTotal) + Number.parseInt(shippingFee);
    total += Number.parseInt((total * tax) / 100);

    const order = await Order.create({
      orderCart,
      tax,
      shippingFee,
      total,
      address,
      user,
    });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
