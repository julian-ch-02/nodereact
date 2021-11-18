const Sequelize = require("sequelize");
const db = require("./index");
const Item = require("./item");

const User = db.sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  role_id: {
    type: Sequelize.INTEGER,
  },
});
Item.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Item, { foreignKey: "user_id" });

module.exports = User;
