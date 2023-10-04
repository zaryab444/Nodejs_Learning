const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login');

router.get('/signup');

router.post('/login');

router.post('/signup', authController.postSignup);

router.post('/logout');

module.exports = router;