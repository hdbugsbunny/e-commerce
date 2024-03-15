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
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
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
  Product.fetchProductById(productId)
    .then(([product]) => {
      if (product && product.length === 0) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editingProduct: !!editMode,
        product: product[0],
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
  const updatedProduct = new Product(
    productId,
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice
  );
  updatedProduct
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
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
  Product.deleteProductById(productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log("🚀 ~ exports.postDeleteProduct ~ error:", error);
    });
};
