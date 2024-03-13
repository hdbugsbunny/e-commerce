const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

//* /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

//* /admin/products => GET
router.get("/products", adminController.getProducts);

//* /admin/product => POST
router.post("/product", adminController.postAddProduct);

//* /admin/edit-product/id => GET
router.get("/edit-product/:productId", adminController.getEditProduct);

//* /admin/editProduct => POST
router.post("/editProduct", adminController.postEditProduct);

module.exports = router;
