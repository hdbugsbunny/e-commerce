const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  const { isAuthenticated } = req.session;
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
        isAuthenticated,
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getProducts = (req, res, next) => {
  const { isAuthenticated } = req.session;
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
        isAuthenticated,
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getProduct = (req, res, next) => {
  const { isAuthenticated } = req.session;
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      console.log("🚀 ~ .then ~ product:", product);
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: "/products",
        isAuthenticated,
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getCart = (req, res, next) => {
  const { user, isAuthenticated } = req.session;
  user
    .populate("cart.items.productId")
    .then((user) => {
      const cartProducts = user.cart.items || [];
      res.render("shop/cart", {
        docTitle: "Your Cart",
        path: "/cart",
        cartProducts,
        isAuthenticated,
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  const { user } = req.session;
  Product.findById(productId)
    .then((product) => {
      return user.addToCart(product);
    })
    .then((cart) => {
      console.log("🚀 ~ .then ~ cart:", cart);
      res.redirect("/cart");
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  const { user } = req.session;
  user
    .deleteItemFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((error) => {
      console.log("🚀 ~ exports.postCartDeleteProduct ~ error:", error);
    });
};

exports.postCartOrder = (req, res, next) => {
  const { user } = req.session;
  user
    .populate("cart.items.productId")
    .then((user) => {
      console.log("🚀 ~ .then ~ user:", user.cart.items);
      const cartProducts = user.cart.items.map((item) => {
        return {
          quantity: item.quantity,
          products: { ...item.productId._doc },
        };
      });
      const order = new Order({
        user: { name: user.name, userId: user },
        items: cartProducts,
      });
      return order.save();
    })
    .then(() => {
      return user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getOrders = (req, res, next) => {
  const { user, isAuthenticated } = req.session;
  Order.find({ "user.userId": user._id })
    .then((orders) => {
      console.log("🚀 ~ .then ~ orders:", orders);
      res.render("shop/orders", {
        docTitle: "Your Orders",
        path: "/orders",
        orders,
        isAuthenticated,
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//   });
// };
