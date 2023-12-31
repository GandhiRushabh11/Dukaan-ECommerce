const asyncHandler = require("../middleware/async.js");
const Cart = require("../models/cart.js");
const Product = require("../models/product.js");
const ErrorResponse = require("../utils/errorResponse.js");

exports.addToCart = asyncHandler(async (req, res, next) => {
  let user = req.user;
  const { productID, qty } = req.body;

  try {
    // -------Get users Cart ------
    let cart = await Cart.findOne({
      user,
    });
    let productDetails = await Product.findById(productID);
    let { name, price, _id } = productDetails;
    if (!productDetails)
      return next(
        new ErrorResponse(`No Product with the id of ${productID}`, 404)
      );
    if (!(qty <= productDetails.qty))
      return next(
        new ErrorResponse(
          `${qty}no. of Product is not in stock ,Please try later`,
          404
        )
      );

    if (cart) {
      //cart exists for user
      let indexFound = cart.items.findIndex((p) => p.product == productID);

      if (indexFound > -1) {
        //product exists in the cart, update the quantity

        cart.items[indexFound].qty = cart.items[indexFound].qty + qty;
        cart.items[indexFound].price = productDetails.price;
        cart.items[indexFound].total =
          productDetails.price * cart.items[indexFound].qty;
        cart.totalCost = cart.items
          .map((item) => item.total)
          .reduce((acc, next) => acc + next);
        cart.totalQty = cart.items.length;
      } else {
        //product does not exists in cart, add new item
        cart.items.push({
          name,
          price,
          qty,
          product: _id,
          total: productDetails.price * qty,
        });
        cart.totalCost = cart.items
          .map((item) => item.total)
          .reduce((acc, next) => acc + next);
        cart.totalQty = cart.items.length;
      }
      cart = await cart.save();
      res.status(200).send({ success: true, cart });
    } else {
      const cart = await Cart.create({
        user,
        items: [
          { name, price, qty, product: _id, total: productDetails.price * qty },
        ],
        totalCost: productDetails.price * qty,
        totalQty: qty,
      });
      res.status(200).send({ success: true, cart });
    }
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
exports.getMyCart = asyncHandler(async (req, res, next) => {
  let user = req.user;

  try {
    // -------Get users Cart ------
    let cart = await Cart.findOne({
      user,
    });
    if (cart) {
      //cart exists for user
      res.status(200).send({ success: true, cart });
    } else {
      return next(
        new ErrorResponse("Please first add some products in your cart", 404)
      );
    }
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
exports.removeItem = asyncHandler(async (req, res, next) => {
  let user = req.user;
  let { productID } = req.body;
  try {
    // -------Get users Cart ------
    let cart = await Cart.findOne({
      user,
    });
    if (cart) {
      //cart exists for user
      let indexFound = cart.items.findIndex((p) => p.product == productID);

      if (indexFound > -1) {
        //product exists in the cart, update the Item
        cart.totalQty = cart.items.length - 1;
        cart.totalCost = cart.totalCost - cart.items[indexFound].total;
        cart.items.splice(indexFound, 1);
      } else {
        return next(new ErrorResponse(`Product does not exist in cart`), 404);
      }
      cart = await cart.save();
      res.status(200).send({ success: true, cart });
    }
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
exports.decreaseQuantity = asyncHandler(async (req, res, next) => {
  let user = req.user;
  const { productID } = req.body;

  try {
    // -------Get users Cart ------
    let cart = await Cart.findOne({
      user,
    });
    let productDetails = await Product.findById(productID);
    if (!productDetails)
      return next(new ErrorResponse(`Product does not exist in cart`, 404));
    if (cart) {
      //cart exists for user
      let indexFound = cart.items.findIndex((p) => p.product == productID);

      if (indexFound > -1) {
        //product exists in the cart, update the quantity

        if (cart.items[indexFound].qty === 1) {
          cart.items[indexFound].qty = cart.items[indexFound].qty - 1;
          cart.totalQty = cart.items.length - 1;
          cart.totalCost = cart.totalCost - cart.items[indexFound].total;
          cart.items.splice(indexFound, 1);
        } else {
          cart.items[indexFound].qty = cart.items[indexFound].qty - 1;
          cart.items[indexFound].total =
            productDetails.price * cart.items[indexFound].qty;
          cart.totalCost = cart.totalCost - productDetails.price;
        }
      } else {
        return next(new ErrorResponse(`Product does not exist in cart`), 404);
      }
      cart = await cart.save();
      res.status(200).send({ success: true, cart });
    }
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});
