const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "harshit", "Harshit@123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
