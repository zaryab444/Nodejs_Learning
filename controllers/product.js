exports.getAddProduct = (req,res,next) =>{
    res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Submit </button></form>');
};

exports.postAddProduct = (req,res,next) =>{
    console.log(req.body);
    res.redirect('/');
}