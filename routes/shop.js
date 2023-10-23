const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../Middleware/is-auth');
const router = express.Router();

router.get('/', shopController.getProducts);
router.get('/cart',  isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.delete('/cart-delete', isAuth, shopController.deleteCart);
router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);
router.get('/checkout', isAuth, shopController.getCheckout);
module.exports = router;