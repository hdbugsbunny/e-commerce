const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
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
