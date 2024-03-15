const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const app = express();

//* Using The Ejs for Dynamic HTML Rendering
app.set("view engine", "ejs");

//* To Setting the HTML Templates if they are with different folder name by default it will check the views folder
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

//! Universal Error Handler
app.use(errorController.get404);

sequelize
  .sync()
  .then((result) => {
    // console.log("🚀 ~ .then ~ result:", result);
    app.listen(3000);
  })
  .catch((error) => {
    console.log("🚀 ~ error:", error);
  });
