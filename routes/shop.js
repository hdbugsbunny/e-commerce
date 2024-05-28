const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//* / => GET
router.get("/", shopController.getIndex);

//* /products => GET
router.get("/products", shopController.getProducts);

//* /products/:productId => GET
router.get("/products/:productId", shopController.getProduct);

//* /cart => GET
router.get("/cart", isAuth, shopController.getCart);

//* /addToCart => POST
router.post("/addToCart", isAuth, shopController.postCart);

//* /delete-cart-item => POST
router.post("/delete-cart-item", isAuth, shopController.postCartDeleteProduct);

//* /orders => GET
router.get("/orders", isAuth, shopController.getOrders);

//* /orders/:orderId => GET
router.get("/orders/:orderId", isAuth, shopController.getInvoiceOrder);

//* /checkout => GET
router.get("/checkout", isAuth, shopController.getCheckout);

//* /checkout/success => GET
router.get("/checkout/success", shopController.getCheckoutSuccess);

//* /checkout.cancel => GET
router.get("/checkout/cancel", shopController.getCheckout);

module.exports = router;
