const express = require('express');
const productController = require('../controllers/product');

const router = express.Router();

 router.get('/all-products', productController.getAllProduct);

router.post('/add-product',productController.postAddProduct);


router.get('/product/:productId', productController.getSingleProduct);

router.delete('/delete-product/:productId', productController.deleteProduct);

router.put('/update-product/:productId', productController.updateSingleProduct);
module.exports = router;