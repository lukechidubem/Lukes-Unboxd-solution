const multer = require('multer');
const sharp = require('sharp');
const Product = require('./../models/productModel');
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/appError');
const filterObject = require('../utilities/filterObject');

// For Image upload
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImage = upload.fields([
  { name: 'product_image', maxCount: 1 },
]);

// Function to resize the product image
exports.resizeProductImage = catchAsync(async (req, res, next) => {
  if (!req.files.product_image) return next();

  req.body.product_image = `product-${req.user.id}-${Date.now()}-product.jpeg`;
  await sharp(req.files.product_image[0].buffer)
    .resize(1200, 1500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.body.product_image}`);

  next();
});

exports.setProductUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Function to Create a product
exports.createProduct = catchAsync(async (req, res, next) => {
  //  Filtered out unwanted fields names that are not allowed to be updated when creating a new product
  const filteredBody = filterObject(
    req.body,
    'product_name',
    'product_description',
    'product_image',
    'product_price',
    'user'
  );
  const product = await Product.create(filteredBody);

  res.status(201).json({
    status: 'success',
    data: {
      data: product,
    },
  });
});

// Function to get a product
exports.getProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError('There is no product with such ID.', 400));
  }

  // Get the id of viewers to prevent multiple view count from a user when they view a product multiple times
  const views = product.product_views_list.filter((id) => req.user.id === id);

  if (views.length < 1 && req.user.id != product.user) {
    // Do the follwing of if it is the user's first view and viewer is not product owner
    product.product_views += 1;
    product.product_views_list.push(req.user.id);
  }

  // Save all changes to the database
  await product.save();

  res.status(201).json({
    status: 'success',
    data: {
      data: product,
    },
  });
});

// Function to Update product
exports.updateProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  //  Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObject(
    req.body,
    'product_name',
    'product_description',
    'product_image',
    'product_price'
  );

  //  Update product
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedProduct,
    },
  });
});

// Function to delete a product
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findByIdAndDelete(productId, {
    new: true,
  });

  if (!product) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Function to upvote or downvote a product
exports.voteProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { type } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError('There is no product with such ID.', 400));
  }

  // Get the id of voters to prevent multiple vote count from a user when they vote multiple times
  const votes = product.product_vote_list.filter((id) => req.user.id === id);

  if (votes.length < 1 && type == 'upvote') {
    product.vote += 1;
    product.product_vote_list.push(req.user.id);
  }

  if (votes.length < 1 && type == 'downvote') {
    product.vote -= 1;
    product.product_vote_list.push(req.user.id);
  }

  // Save all changes to the database
  await product.save();

  res.status(201).json({
    status: 'success',
    data: {
      data: product,
    },
  });
});
