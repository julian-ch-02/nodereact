const Sequelize = require("sequelize");
const db = require("./index");
const Image = require("./image");

const Item = db.sequelize.define("items", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: Sequelize.TEXT,
  },
  user_id: {
    type: Sequelize.INTEGER,
  },
});

Image.belongsTo(Item, { foreignKey: "item_id" ,onDelete:"CASCADE"});
Item.hasMany(Image, { foreignKey: "item_id",onDelete:"CASCADE" });

module.exports = Item;
