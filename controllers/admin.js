const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  const { isAuthenticated } = req.session;
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editingProduct: false,
    isAuthenticated,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const { user } = req;
  const product = new Product({
    title,
    imageUrl,
    description,
    price,
    userId: user,
  });
  product
    .save()
    .then((result) => {
      console.log("Created product");
      res.redirect("/");
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const { isAuthenticated } = req.session;
  const { editMode } = req.query;
  if (!Boolean(editMode)) {
    return res.redirect("/");
  }
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editingProduct: !!editMode,
        product,
        isAuthenticated,
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

  Product.findById(productId)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      product.price = updatedPrice;
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
  const { isAuthenticated } = req.session;
  Product.find()
    // .select("title price -_id") //* Which keys I want to retrieve
    // .populate("userId", "name") //* Same as select
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated,
      });
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findByIdAndDelete(productId)
    .then(() => res.redirect("/admin/products"))
    .catch((error) => {
      console.log("🚀 ~ exports.postDeleteProduct ~ error:", error);
    });
};
