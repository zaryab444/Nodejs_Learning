const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const helmet = require('helmet');
const compression = require('compression');
const morgan = require("morgan");
const fs = require('fs');
const path = require('path');
const https = require('https');

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.vxg4vcp.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const adminRoutes = require("./routes/product");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.filename + '-' + file.originalname); 
  }
});

const fileFilter = (req, file, cb) => {
 if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
  cb(null, true);
 } else {
  cb(null, false);
 }
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),{
  flags: 'a'
});
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getError);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // https.createServer.listen({key: privateKey, cert: certificate}, app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
    console.log("Database Connected Successfully!");
  })
  .catch((err) => {
    console.log(err);
  });
