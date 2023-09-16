const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);
app.listen(3000);