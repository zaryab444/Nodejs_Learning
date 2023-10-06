const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const User = require("../models/user");

const config = {
  service: "gmail",
  host: "smtp.gmail.com", // Correct the typo in 'smtp.gmail.com'
  port: 587,
  secure: false,
  auth: {
    user: "sohail.zaryab61@gmail.com",
    pass: "afmr ofwg udnx apno"
  }
}

const send = (data) => {
  const transporter = nodemailer.createTransport(config);
  transporter.sendMail(data, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      return info.response;
    }
  });
};

exports.postEmail = async (req, res, next) => {
  const { from, to, subject, text } = req.body;
  const data = { from, to, subject, text };
  
  // Call the 'send' function defined above
  send(data);

  res.send("Email sent"); // You can send a response here or handle it as needed.
};



//http://localhost:3000/signup (Post Request)
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.json({ message: "Duplicate email exist" });
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { item: [] },
      });
      return user.save();
    })
    .then((result) => {
      const data = {
        to: email,
        from: 'shop@node-complete.com',
        subject: 'Signup succeeded!',
        html: '<h1>You successfully signed up!</h1>'
        };
      send(data);
      res.json({ message: "Signup Successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.json({ message: "Invalid Username or Password" });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.json({ message: "Login Successfully" });
            });
          }
          res.json({ message: "Invalid Username or Password" });
        })
        .catch((err) => {
          console.log(err);
          res.json({ message: "Invalid Username or Password" });
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.json({ message: "logout successfully" });
  });
};

//http://localhost:3000/reset (Post Request)
// {
//   "email": "enter those who registerd"
// }
exports.postReset = (req,res,next) => {
crypto.randomBytes(32, (err,buffer) =>{
  if(err){
    console.log(err);
  }
  const token = buffer.toString('hex');
  User.findOne({email: req.body.email}).then(
    user => {
      if(!user){
       return res.json({ message: "No account with that email found" });
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000 //1 hour
      return user.save();
    })
    .then(result => {
      res.json({message: "Please check your email"})
      const data = {
        to: req.body.email,
        from: 'shop@node-complete.com',
        subject: 'Password Reset!',
        html: `
        <p> You requested a password reset </p>
        <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set the new password </p>
        `
        };
      send(data);
    })
    .catch(err => {
    console.log(err);
  })
})
}

exports.getNewPassword = (req,res,next) => {
   const token = req.params.token;
   User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
   .then(user =>{

   })
   .catch(err =>{
    console.log(err);
   });
}
