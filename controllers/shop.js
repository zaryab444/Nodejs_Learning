const Product = require('../models/product');

exports.getProducts = (req,res,next) =>{
    res.send('Main middleware'); 
 }

 //http://localhost:3000/cart (Post Request)
 //pass payload product id   
//  {
//     "productId":"paste productId here"
//  }
 exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then(product => {
        return req.user.addToCart(product);
      })
      .then(result => {
        res.json(result);
      });
  };