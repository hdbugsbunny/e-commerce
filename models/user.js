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
    // const cartProduct = this.cart.items.findIndex(
    //   (item) => item._id === product._id
    // );
    const updatedCart = { items: [{ productId: product._id, quantity: 1 }] };
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
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
