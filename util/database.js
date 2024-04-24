const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require("dotenv").config();

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      console.log("🚀 Connected!");
      _db = client.db();
      callback();
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
      throw error;
    });
};

const getDb = () => {
  if (_db) return _db;
  throw "No Database Connection!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
