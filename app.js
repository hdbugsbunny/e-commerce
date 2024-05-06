const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");

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
  User.findById("6638c06182a1a0a5084ca839")
    .then((user) => {
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

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Harshit",
          email: "harshit@test.com",
          cart: { items: [] },
        });
        user.save();
      }
    });
    app.listen(process.env.PORT || 3000);
  })
  .catch((error) => {
    console.log("🚀 ~ error:", error);
  });
