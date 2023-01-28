const User = require('./../models/userModel');
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/appError');
const filterObject = require('../utilities/filterObject');
const Product = require('../models/productModel');

// Function to get the current user
exports.getCurrentUser = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;

  let query = User.findById(req.params.id);
  const user = await query;

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

// Function to get other users
exports.getOtherUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  let query = User.findById(userId);
  const user = await query;

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

// Function to update user data
exports.updateUser = catchAsync(async (req, res, next) => {
  // Create error if user POSTs password data
  if (req.body.password || req.body.confirm_password) {
    return next(new AppError('This route is not for password updates.', 400));
  }

  //  Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObject(
    req.body,
    'first_name',
    'last_name',
    'email',
    'phone',
    'bio'
  );

  //  Update user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Function to get user's page and product
exports.getUserPage = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  const allProducts = await Product.find();

  const userProducts = await allProducts.filter(
    (product) => product.user == userId
  );

  if (!user) {
    return next(new AppError('There is no user with such ID.', 400));
  }

  if (req.user.id != user._id) user.page_views += 1;

  await user.save();

  res.status(201).json({
    status: 'success',
    data: {
      user_data: user,
      user_products: userProducts,
    },
  });
});
