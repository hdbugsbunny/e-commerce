const fs = require("fs");
const path = require("path");

const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
      });
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      console.log("🚀 ~ .then ~ product:", product);
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.getCart = (req, res, next) => {
  const { user } = req;
  user
    .populate("cart.items.productId")
    .then((user) => {
      const cartProducts = user.cart.items || [];
      res.render("shop/cart", {
        docTitle: "Your Cart",
        path: "/cart",
        cartProducts,
      });
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  const { user } = req;
  Product.findById(productId)
    .then((product) => {
      return user.addToCart(product);
    })
    .then((cart) => {
      console.log("🚀 ~ .then ~ cart:", cart);
      res.redirect("/cart");
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
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
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.postCartOrder = (req, res, next) => {
  const { user } = req;
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
        user: { email: user.email, userId: user },
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
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.getOrders = (req, res, next) => {
  const { user } = req;
  Order.find({ "user.userId": user._id })
    .then((orders) => {
      console.log("🚀 ~ .then ~ orders:", orders);
      res.render("shop/orders", {
        docTitle: "Your Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.getInvoiceOrder = (req, res, next) => {
  const { orderId } = req.params;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No Order Found!"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized User!"));
      }

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);

      fs.readFile(invoicePath, (error, data) => {
        if (error) {
          return next(error);
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
        res.send(data);
      });
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//   });
// };
