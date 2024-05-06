const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; //* {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(
//       (item) => item.productId.toString() === product._id.toString()
//     );
//     const updatedCartItems = [...this.cart.items];
//     let newQuantity = 1;

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({ productId: product._id, quantity: newQuantity });
//     }

//     const updatedCart = { items: updatedCartItems };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }

//   getUserCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((item) => item.productId);
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         console.log("🚀 ~ User ~ .then ~ products:", products);
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(
//               (item) => item.productId.toString() === product._id.toString()
//             ).quantity,
//           };
//         });
//       })
//       .catch((error) => {
//         console.log("🚀 ~ User ~ getUserCart ~ error:", error);
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId.toString()
//     );

//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getUserCart()
//       .then((products) => {
//         console.log("🚀 ~ User ~ this.getUserCart ~ products:", products);
//         const order = {
//           items: products,
//           user: { _id: this._id, name: this.name },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
//       })
//       .catch((error) => {
//         console.log("🚀 ~ User ~ addOrder ~ error:", error);
//       });
//   }

//   getUserOrders() {
//     const db = getDb();
//     return db.collection("orders").find({ "user._id": this._id }).toArray();
//   }

//   static fetchUserById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: mongodb.ObjectId.createFromHexString(userId) })
//       .then((user) => {
//         console.log("🚀 ~ User ~ .then ~ user:", user);
//         return user;
//       })
//       .catch((error) => {
//         console.log("🚀 ~ User ~ fetchUserById ~ error:", error);
//       });
//   }
// }

// module.exports = User;
