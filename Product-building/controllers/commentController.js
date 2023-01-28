const Comment = require('./../models/commentModel');
const catchAsync = require('./../utilities/catchAsync');

exports.setProdutCommentUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Function to Create a comment on a product
exports.createComment = catchAsync(async (req, res, next) => {
  const { name, comment, user, product } = req.body;

  const newComment = await Comment.create({ name, comment, user, product });

  res.status(201).json({
    status: 'success',
    data: {
      data: newComment,
    },
  });
});
