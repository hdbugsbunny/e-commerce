const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; //* {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log("🚀 ~ User ~ .then ~ result:", result);
      })
      .catch((error) => {
        console.log("🚀 ~ User ~ save ~ error:", error);
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      (item) => item.productId.toString() === product._id.toString()
    );
    const updatedCartItems = [...this.cart.items];
    let newQuantity = 1;

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: newQuantity });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  getUserCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => item.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        console.log("🚀 ~ User ~ .then ~ products:", products);
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (item) => item.productId.toString() === product._id.toString()
            ).quantity,
          };
        });
      })
      .catch((error) => {
        console.log("🚀 ~ User ~ getUserCart ~ error:", error);
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  static fetchUserById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: mongodb.ObjectId.createFromHexString(userId) })
      .then((user) => {
        console.log("🚀 ~ User ~ .then ~ user:", user);
        return user;
      })
      .catch((error) => {
        console.log("🚀 ~ User ~ fetchUserById ~ error:", error);
      });
  }
}

module.exports = User;
