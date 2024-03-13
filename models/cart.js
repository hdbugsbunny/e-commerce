const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, price) {
    // TODO: Fetch the previous cart
    fs.readFile(p, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(data);
      }
      // TODO: Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // TODO: Add new product/increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +price;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log("🚀 ~ Cart ~ fs.writeFile ~ err:", err);
      });
    });
  }

  static deleteProduct(id, price) {
    // TODO: Fetch the cart
    fs.readFile(p, (err, data) => {
      if (err) return;
      const updatedCart = { ...JSON.parse(data) };
      // TODO: Analyze the cart => Find existing product to delete
      const deletedProduct = updatedCart.products.find((p) => p.id === id);
      // TODO: Update Cart with updated products
      updatedCart.products = updatedCart.products.filter((p) => p.id !== id);
      updatedCart.totalPrice -= price * deletedProduct.qty;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log("🚀 ~ Cart ~ fs.writeFile ~ err:", err);
      });
    });
  }
};
