const Product = require('./../models/productModel');
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/appError');
const filterObject = require('../utilities/filterObject');
const Order = require('../models/orderModel');

exports.setProdutOrderUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

// Function to create an Order
exports.createOrder = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError('There is no product with such ID.', 400));
  }

  req.body.price = product.product_price;

  //  Filtered out unwanted fields names that are not allowed to be updated when creating a new product
  const filteredBody = filterObject(req.body, 'price', 'product', 'user');

  const newOrder = await Order.create(filteredBody);

  res.status(201).json({
    status: 'success',
    data: {
      data: newOrder,
    },
  });
});
