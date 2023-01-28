const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/me', userController.getCurrentUser);
router.get('/:userId', userController.getOtherUser);

router.get('/page/:userId', userController.getUserPage);
router.put('/', userController.updateUser);

module.exports = router;
