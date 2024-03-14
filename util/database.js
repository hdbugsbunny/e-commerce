const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "harshit",
  database: "node-complete",
  password: "Harshit@123",
});

module.exports = pool.promise();
