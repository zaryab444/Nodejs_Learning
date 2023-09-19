const Product = require("../models/product");

//http://localhost:3000/admin/all-product (Get Request)
exports.getAllProduct = async (req, res, next) => {
  const products = await Product.find({});
  res.json(products);
};

//http://localhost:3000/admin/add-product (Post Request)
exports.postAddProduct = async (req, res, next) => {
  let product = new Product({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description,
  });
  product = await product.save();
  res.status(200).json(product);
};

//http://localhost:3000/admin/product/productId (Get Request)
exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req?.params?.productId);
  if(product){
    return res.json(product);
  }
  else {
    res.status(404).json({message: 'Resource not found'});
  }
};

//http://localhost:3000/admin/update-product/65098462db8bcb888d47f1e3 (Put request)
exports.updateSingleProduct = async (req,res,next) =>{
  const { title, imageUrl, price, description } =
  req.body;
  const product = await Product.findById(req.params.productId);
  if (product) {
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  }
  else {
    res.status(404).json({message: 'Resource not found'});
  }
};

//http://localhost:3000/admin/delete-product/productId 
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: product._id });

    return res.status(200).json({ message: 'Product Deleted' });
  } catch (error) {
    return next(error);
  }
};

