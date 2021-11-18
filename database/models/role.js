const Sequelize = require("sequelize");
const db = require("./index");
const User = require("./user");

const Role = db.sequelize.define("roles", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
});

User.belongsTo(Role, { foreignKey: "role_id" });
Role.hasOne(User, { foreignKey: "role_id" });

module.exports = Role;
