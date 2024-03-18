const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

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
  User.findByPk(1)
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

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log("🚀 ~ .then ~ result:", result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Harshit", email: "harshit@test.com" });
    }
    return user;
  })
  .then((user) => {
    // console.log("🚀 ~ .then ~ user:", user);
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log("🚀 ~ error:", error);
  });
