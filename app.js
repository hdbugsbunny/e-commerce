const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(expressSession);
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");

require("dotenv").config();

const User = require("./models/user");

const app = express();
const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

//* Using The Ejs for Dynamic HTML Rendering
app.set("view engine", "ejs");

//* To Setting the HTML Templates if they are with different folder name by default it will check the views folder
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  expressSession({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use(csrfProtection);
app.use(flash());

//! Config the User
app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch((error) => {
      throw new Error(error);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//! Universal Something Went Wrong Handler
app.use(errorController.get500);

//! Universal Error Handler
app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 3000))
  .catch((error) => {
    console.log("🚀 ~ error:", error);
  });
