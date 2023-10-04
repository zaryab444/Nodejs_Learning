const express = require('express');
const productController = require('../controllers/product');
const isAuth = require('../Middleware/is-auth');

const router = express.Router();

 router.get('/all-products', productController.getAllProduct);

router.post('/add-product', isAuth,productController.postAddProduct);


router.get('/product/:productId', productController.getSingleProduct);

router.delete('/delete-product/:productId', productController.deleteProduct);

router.put('/update-product/:productId', productController.updateSingleProduct);
module.exports = router;