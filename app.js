const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;

require("dotenv").config();

const User = require("./models/user");

const app = express();

//* Using The Ejs for Dynamic HTML Rendering
app.set("view engine", "ejs");

//* To Setting the HTML Templates if they are with different folder name by default it will check the views folder
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//! Config the User
app.use((req, res, next) => {
  User.fetchUserById("6629e9776e76794b1677a688")
    .then((user) => {
      console.log("🚀 ~ .then ~ user:", user);
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log("🚀 ~ app.use ~ error:", error);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

//! Universal Error Handler
app.use(errorController.get404);

mongoConnect(() => {
  app.listen(process.env.PORT || 3000);
});
