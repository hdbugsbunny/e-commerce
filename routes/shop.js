const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/addToCart", isAuth, shopController.postCart);

router.post("/delete-cart-item", isAuth, shopController.postCartDeleteProduct);

router.post("/create-order", isAuth, shopController.postCartOrder);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoiceOrder);

router.get("/checkout", isAuth, shopController.getCheckout);

module.exports = router;
