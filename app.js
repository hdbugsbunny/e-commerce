const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const db = require("./util/database");

const errorController = require("./controllers/error");

const app = express();

//* Using The Ejs for Dynamic HTML Rendering
app.set("view engine", "ejs");

//* To Setting the HTML Templates if they are with different folder name by default it will check the views folder
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

db.execute("SELECT * FROM products")
  .then((result) => {
    console.log("🚀 ~ .then ~ result[0]:", result[0]);
    console.log("🚀 ~ .then ~ result[1]:", result[1]);
  })
  .catch((err) => {
    console.log("🚀 ~ err:", err);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

//! Universal Error Handler
app.use(errorController.get404);

app.listen(3000);
