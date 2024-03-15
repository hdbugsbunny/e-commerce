const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editingProduct: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const { user } = req;
  user
    .createProduct({ title, imageUrl, description, price })
    .then((result) => {
      console.log("Created product");
      res.redirect("/");
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const { editMode } = req.query;
  if (!Boolean(editMode)) {
    return res.redirect("/");
  }
  const { productId } = req.params;
  Product.findByPk(productId)
    .then((product) => {
      if (product && product.length === 0) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editingProduct: !!editMode,
        product: product,
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const {
    productId,
    title: updatedTitle,
    imageUrl: updatedImageUrl,
    description: updatedDescription,
    price: updatedPrice,
  } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      product.title = updatedTitle;
      product.description = updatedDescription;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("Updating Products");
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  //? Preferred Approach Using destroy and WHERE Parameters
  Product.destroy({ where: { id: productId } })
    .then(() => res.redirect("/admin/products"))
    .catch((error) => {
      console.log("🚀 ~ exports.postDeleteProduct ~ error:", error);
    });

  //? Other Approach Using findByPk
  // Product.findByPk(productId)
  //   .then((product) => {
  //     return product.destroy();
  //   })
  //   .then(() => {
  //     res.redirect("/admin/products");
  //   })
  //   .catch((error) => {
  //     console.log("🚀 ~ exports.postDeleteProduct ~ error:", error);
  //   });
};
