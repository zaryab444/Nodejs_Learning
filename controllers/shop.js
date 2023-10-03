const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  res.send("Main middleware");
};

//http://localhost:3000/cart (Post Request)
//pass payload product id
//  {
//     "productId":"paste productId here"
//  }
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.json(result);
    });
};

//http://localhost:3000/cart  (Get Request)
exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      res.json(products);
    })
    .catch(err => console.log(err));
};

//http://localhost:3000/cart-delete  (Delete Request)
//pass payload product id
//  {
//     "productId":"paste productId here"
//  }
exports.deleteCart = (req,res,next) =>{
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId).then(result => {
    res.json('Cart Deleted!')
  })
  .catch(err => console.log(err));
};

