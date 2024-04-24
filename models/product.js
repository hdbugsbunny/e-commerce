const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log("🚀 ~ Product ~ .then ~ result:", result);
      })
      .catch((error) => {
        console.log("🚀 ~ Product ~ save ~ error:", error);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log("🚀 ~ Product ~ .then ~ products:", products);
        return products;
      })
      .catch((error) => {
        console.log("🚀 ~ Product ~ fetchAll ~ error:", error);
      });
  }
}

module.exports = Product;
