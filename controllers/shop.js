const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      docTitle: "Shop",
      path: "/",
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.fetchProductById(productId, (product) => {
    console.log("🚀 ~ Product.fetchProductById ~ product:", product);
  });
  res.redirect("/");
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "Your Cart",
    path: "/cart",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};
