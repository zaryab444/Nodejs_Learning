const express = require('express');
const productController = require('../controllers/product');
const isAuth = require('../Middleware/is-auth');

const router = express.Router();

 router.get('/all-products', productController.getAllProduct);

router.post('/add-product', isAuth,productController.postAddProduct);


router.get('/product/:productId',  isAuth, productController.getSingleProduct);

router.delete('/delete-product/:productId',  isAuth, productController.deleteProduct);

router.put('/update-product/:productId',  isAuth, productController.updateSingleProduct);
router.get('/paginate', productController.getIndex);
module.exports = router;