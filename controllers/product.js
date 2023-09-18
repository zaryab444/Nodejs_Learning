const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.send(
    '<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Submit </button></form>'
  );
};

exports.postAddProduct = (req, res, next) => {
  let product = new Product({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description,
  });
  product
    .save()
    .then((result) => {
      res.send("Product Created");
    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
};
