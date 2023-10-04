const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.postSignup = (req,res,next) =>{
   const email = req.body.email;
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;
   User.findOne({email: email})
   .then(userDoc =>{
    if(userDoc) {
       return res.json({message: 'Duplicate email exist'});
    }
    return bcrypt.hash(password, 12);
   })
   .then(hashedPassword => {
    const user = new User({
        email: email,
        password: hashedPassword,
        cart: {item:[]}
    });
   return user.save();
   })
   .then(result =>{
    res.json({message: 'Signup Successfully'});
   })
   .catch(err =>{
    console.log(err);
   });
}