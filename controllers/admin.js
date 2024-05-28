const fileHelper = require("../util/file");

const { validationResult } = require("express-validator");

const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editingProduct: false,
    hasErrors: false,
    errorMessage: "",
    totalErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, description, price } = req.body;
  const { user, file: imageFile } = req;
  if (!imageFile) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      editingProduct: false,
      hasErrors: true,
      product: { title, description, price },
      errorMessage: "Attached File is Not an Image!",
      totalErrors: [],
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      editingProduct: false,
      hasErrors: true,
      product: { title, description, price },
      errorMessage: errors.array()[0].msg,
      totalErrors: errors.array(),
    });
  }

  const imageUrl = imageFile.path;

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
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.getEditProduct = (req, res, next) => {
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
        hasErrors: false,
        errorMessage: "",
        totalErrors: [],
        product,
      });
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { _id } = req.user;
  const {
    productId,
    title: updatedTitle,
    description: updatedDescription,
    price: updatedPrice,
  } = req.body;
  const { file: imageFile } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editingProduct: true,
      hasErrors: true,
      errorMessage: "",
      product: {
        _id: productId,
        title: updatedTitle,
        description: updatedDescription,
        price: updatedPrice,
      },
      errorMessage: errors.array()[0].msg,
      totalErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== _id.toString()) {
        return res.redirect("/");
      }

      product.title = updatedTitle;
      if (imageFile) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = imageFile.path;
      }
      product.description = updatedDescription;
      product.price = updatedPrice;
      return product.save().then((result) => {
        console.log("Updating Products");
        res.redirect("/admin/products");
      });
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.getProducts = (req, res, next) => {
  const { _id } = req.user;
  const ITEMS_PER_PAGE = 2;
  const page = +req.query.page || 1;
  let totalProducts = 0;

  Product.find({ userId: _id })
    // .select("title price -_id") //* Which keys I want to retrieve
    // .populate("userId", "name") //* Same as select
    .countDocuments()
    .then((numProducts) => {
      totalProducts = numProducts;
      return Product.find({ userId: _id })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      });
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.deleteAdminProduct = (req, res, next) => {
  const { productId } = req.params;
  const { _id } = req.user;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product Not Found!"));
      }

      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: productId, userId: _id });
    })
    .then(() =>
      res.status(200).json({ message: "Product Deleted Successfully!" })
    )
    .catch(() => res.status(500).json({ message: "Product Deletion Failed!" }));
};
