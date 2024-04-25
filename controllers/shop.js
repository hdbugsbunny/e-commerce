const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.fetchById(productId)
    .then((product) => {
      console.log("🚀 ~ .then ~ product:", product);
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getCart = (req, res, next) => {
  const { user } = req;
  user
    .getUserCart()
    .then((cartProducts) => {
      res.render("shop/cart", {
        docTitle: "Your Cart",
        path: "/cart",
        cartProducts,
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  const { user } = req;
  Product.fetchById(productId)
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
  const { user } = req;
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
  const { user } = req;
  user
    .addOrder()
    .then(() => {
      res.redirect("/orders");
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getOrders = (req, res, next) => {
  const { user } = req;
  user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      console.log("🚀 ~ .then ~ orders:", orders);
      res.render("shop/orders", {
        docTitle: "Your Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};
