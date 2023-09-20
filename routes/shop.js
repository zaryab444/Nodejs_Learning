const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();

router.get('/', shopController.getProducts);
router.post('/cart', shopController.postCart);
module.exports = router;