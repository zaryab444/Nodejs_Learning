const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

mongoose.connect('mongodb+srv://sohailzaryab61:oRrCo3gi7Hyzzvf8@cluster0.vxg4vcp.mongodb.net/shop?retryWrites=true&w=majority').then(result =>{
   app.listen(3000); 
   console.log('Database Connected Successfully!')
}).catch(err =>{
    console.log(err);
});