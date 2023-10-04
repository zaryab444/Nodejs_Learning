const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();

router.get('/', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.delete('/cart-delete', shopController.deleteCart);
router.post('/create-order', shopController.postOrder);
router.get('/orders', shopController.getOrders);
module.exports = router;