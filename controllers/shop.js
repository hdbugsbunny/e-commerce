const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  Product.findAll()
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
  Product.findAll()
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
  //? Preferred Approach Using findByPk
  Product.findByPk(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });

  //? Other Approach Using findAll with WHERE
  // Product.findAll({ where: { id: productId } })
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       product: product[0],
  //       docTitle: product[0].title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((error) => {
  //     console.log("🚀 ~ error:", error);
  //   });
};

exports.getCart = (req, res, next) => {
  const { user } = req;
  user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
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
  Product.fetchProductById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.fetchProductById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
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
