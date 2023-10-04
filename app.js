const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://sohailzaryab61:oRrCo3gi7Hyzzvf8@cluster0.vxg4vcp.mongodb.net/shop?retryWrites=true&w=majority'

const adminRoutes = require('./routes/product');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection)

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getError);

mongoose.connect(MONGODB_URI).then(result =>{
   app.listen(3000); 
   console.log('Database Connected Successfully!')
}).catch(err =>{
    console.log(err);
});