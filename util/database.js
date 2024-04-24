const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://ecommerce-admin:Yxe8n7h2CpanV6qC@cluster0.kglxu6p.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
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
