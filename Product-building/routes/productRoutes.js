const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const commentController = require('../controllers/commentController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(productController.getProduct)
  .post(
    productController.uploadProductImage,
    productController.resizeProductImage,
    productController.setProductUserIds,
    productController.createProduct
  );

router
  .route('/:productId')
  .put(
    productController.uploadProductImage,
    productController.resizeProductImage,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

router
  .route('/comment/:productId')
  .post(
    commentController.setProdutCommentUserIds,
    commentController.createComment
  );

router.route('/vote/:productId').post(productController.voteProduct);

router
  .route('/order/:productId')
  .post(orderController.setProdutOrderUserIds, orderController.createOrder);

module.exports = router;
