const Sequelize = require("sequelize");
const db = require("./index");

const Image = db.sequelize.define("images", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  item_id: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Image;
