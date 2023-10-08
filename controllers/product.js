const Product = require("../models/product");
const ITEMS_PER_PAGE = 2;
//http://localhost:3000/admin/all-products (Get Request)
exports.getAllProduct = async (req, res, next) => {
  const products = await Product.find({});
  res.json(products);
};

//http://localhost:3000/admin/add-product (Post Request)
exports.postAddProduct = async (req, res, next) => {
  const image = req.file;
  
  const imageUrl = image.path;
  let product = new Product({
    title: req.body.title,
    imageUrl: imageUrl,
    price: req.body.price,
    description: req.body.description,
    userId: req.user
  });
  if(!product.imageUrl){
      return res.status(400).json({message: 'bad iamge request'});
  }

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

// http://localhost:3000/admin/paginate (Get Request)

// {
//     "page":1 or 2 or 3 or 4 
// }

exports.getIndex = (req, res, next) => {
  const page = req.body.page;
  console.log(page);
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      console.log(products);
      res.json({
        totalProducts: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        products: products
      })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};