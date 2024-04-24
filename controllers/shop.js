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
      console.log("🚀 ~ .then ~ product:", product)
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
  //? Preferred Approach Using findByPk
  // Product.findByPk(productId)
  // .then((product) => {
  //   res.render("shop/product-detail", {
  //     product: product,
  //     docTitle: product.title,
  //     path: "/products",
  //   });
  // })
  // .catch((error) => {
  //   console.log("🚀 ~ error:", error);
  // });

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
  const { user } = req;
  let fetchedCart;
  let newQuantity = 1;
  user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((cartProducts) => {
      let cartProduct;
      if (cartProducts.length > 0) {
        cartProduct = cartProducts[0];
      }
      if (cartProduct) {
        const oldQuantity = cartProduct.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return cartProduct;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
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
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((error) => {
      console.log("🚀 ~ exports.postCartDeleteProduct ~ error:", error);
    });
};

exports.postCartOrder = (req, res, next) => {
  let fetchedCart;
  const { user } = req;
  user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((error) => {
          console.log("🚀 ~ .then ~ error:", error);
        });
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
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
