const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login');

router.get('/signup');

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);


module.exports = router;