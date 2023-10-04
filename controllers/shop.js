const Product = require("../models/product");
const Order = require("../models/order");

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
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.json(products);
    })
    .catch((err) => console.log(err));
};

//http://localhost:3000/cart-delete  (Delete Request)
//pass payload product id
//  {
//     "productId":"paste productId here"
//  }
exports.deleteCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.json("Cart Deleted!");
    })
    .catch((err) => console.log(err));
};

//firstly add the product and then post to cart and then place order
//http://localhost:3000/create-order (Post Request)
exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } }; //we user _doc because they give all product object this is mongoose property
      });

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      res.json({ message: "Order placed" });
    })
    .catch((err) => console.log(err));
};

//http://localhost:3000/orders (Get Request)
// 1)We use the reduce function to calculate the total price of orders.
// 2) Within the outer reduce, we iterate through each order and calculate the order total by using another reduce function.
// 3)The inner reduce calculates the sum of prices for each product in the order, and the outer reduce accumulates these order totals to get the overall total price.
//without reduce we use nested loop which is more complex the code

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      const totalPrice = orders.reduce((total, order) => {
        const orderTotal = order.products.reduce((subtotal, product) => {
          return subtotal + product.product.price * product.quantity;
        }, 0);

        return total + orderTotal;
      }, 0);

      res.json({
        totalPrice: totalPrice.toFixed(2),
        orders,
      });
    })
    .catch((err) => console.log(err));
};

