const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//* /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

//* /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

//* /admin/product => POST
router.post(
  "/product",
  [
    body("title", "Book Title Should be String And Atleast 3 Characters!")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Book Price Should be Valid Floating Number!").isFloat(),
    body("description", "Book Description Atleast 5 Characters!")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

//* /admin/edit-product/id => GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

//* /admin/editProduct => POST
router.post(
  "/editProduct",
  [
    body("title", "Book Title Should be String And Atleast 3 Characters!")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Book Price Should be Valid Floating Number!").isFloat(),
    body("description", "Book Description Atleast 5 Characters!")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

//* /admin/delete-product => POST
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
