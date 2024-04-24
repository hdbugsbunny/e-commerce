const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://ecommerce-admin:Yxe8n7h2CpanV6qC@cluster0.kglxu6p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((result) => {
      console.log("🚀 ~ result Connected:");
      callback(result);
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

module.exports = mongoConnect;
