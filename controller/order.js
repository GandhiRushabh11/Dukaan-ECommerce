const Cart = require("../models/cart.js");
const Order = require("../models/order.js");
const paypal = require("paypal-rest-sdk");
const asyncHandler = require("../middleware/async.js");
const ErrorResponse = require("../utils/errorResponse.js");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AcLcf32f8JrH_32DS66wfAb3T_-8krVsJaHcxJufS-PrS_D6T04yWbV5QxI7PT9S_3MqUNOmPcFju1gv",
  client_secret:
    "EM_-StXbdaimswoNQZihYE5DWQlbuzAbQUCTeKqQ9e3huy8_mR1K5Grp3jAXiXej6jT5X3gw_t5k4gev",
});
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

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    if (orders) {
      res.status(200).send({ success: true, orders });
    } else {
      return next(new ErrorResponse("No orders found", 404));
    }
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user });
    if (orders) {
      res.status(200).send({ success: true, orders });
    } else {
      return next(new ErrorResponse("No orders found", 404));
    }
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};
exports.getMyOrder = async (req, res, next) => {
  try {
    let orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return next(
        new ErrorResponse("Not authorized to access this Order", 404)
      );
    }
    if (!(order.user._id.toString() === req.user._id.toString())) {
      return next(
        new ErrorResponse(`Not authorized to access this Order`, 400)
      );
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    let orderId = req.params.id;
    let order = await Order.findById(orderId);
    if (!order) {
      return next(
        new ErrorResponse("Not authorized to access this Order", 404)
      );
    }
    if (!(order.user._id.toString() === req.user._id.toString())) {
      return next(
        new ErrorResponse(`Not authorized to access this Order`, 400)
      );
    }
    order.status = "canceled";
    order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};
exports.pay = async (req, res, next) => {
  let orderId = req.params.id;
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new ErrorResponse("Not authorized to access this Order", 404));
  }
  if (
    order.status === "paid" ||
    order.status === "delivered" ||
    order.status === "canceled"
  ) {
    return next(
      new ErrorResponse(`You Orders already has been ${order.status}`, 400)
    );
  }

  createPayment(order, res);
};
exports.verifySuccessPayment = async (req, res, next) => {
  const paymentId = req.query.paymentId;
  const payerId = req.query.PayerID;
  try {
    let order = await Order.find({ "paymentDetails.paymentId": paymentId });
    if (!order) {
      return next(
        new ErrorResponse("Not authorized to access this Order", 404)
      );
    }
    order = order.length > 0 ? order[0] : {};
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: order.total,
          },
        },
      ],
    };
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          order.status = "failed";
          order.paymentDetails.paymentState = "failed";
          console.log(error.response);
          return next(new ErrorResponse(error, 404));
        } else {
          order.status = "paid";
          order.paymentDetails.paymentState = payment.state;
          order.paymentDetails.payerInfo.push(payment.payer);
          order.paymentDetails.token = req.query.token;
          order.save();
          res.status(200).json({ success: true, data: order });
        }
      }
    );
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};

function createPayment(order, res) {
  let create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:8000/api/v1/order/success",
      cancel_url: "http://localhost:8000/api/v1/order/cancel",
    },
    transactions: [
      {
        amount: {
          currency: "USD",
          total: order["total"],
        },
        description: "This is the payment description.",
      },
    ],
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      return next(new ErrorResponse(error, 404));
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          order.paymentDetails.paymentId = payment.id;
          order.save();
          console.log(payment.links[i].href);
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
}
