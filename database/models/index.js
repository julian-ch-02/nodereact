const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize(process.env.DEV_DB_NAME, process.env.DEV_DB_USERNAME, process.env.DEV_DB_PASSWORD, {
  host: process.env.DEV_DB_HOST,
  dialect: "mysql",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
