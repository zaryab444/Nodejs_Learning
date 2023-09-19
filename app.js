const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const userRoutes = require('./routes/user');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    User.findById('650999ae635ec6d9c168f75f')
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });
app.use('/admin',adminRoutes);
// app.use('/user', userRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

mongoose.connect('mongodb+srv://sohailzaryab61:oRrCo3gi7Hyzzvf8@cluster0.vxg4vcp.mongodb.net/shop?retryWrites=true&w=majority').then(result =>{
    User.findOne().then(user =>{
        if(!user){
            const user = new User({
                name:'Max',
                email:'max@gmail.com',
                cart: {
                    items:[]
                }
            });
            user.save();
        }
    });
   app.listen(3000); 
   console.log('Database Connected Successfully!')
}).catch(err =>{
    console.log(err);
});