const { authCheck } = require("../util/authCheck");
const User = require("../database/models/user");
const Item = require("../database/models/item");
const Image = require("../database/models/image");
const db = require("../database/models/index");
const { UserInputError } = require("apollo-server-errors");

const CREATED_ITEM = "CREATED_ITEM";
const UPDATED_ITEM = "UPDATED_ITEM";
const DELETED_ITEM = "DELETED_ITEM";

const getItems = async (_, args, context) => {
  const { username } = await authCheck(context);
  const itemsFromDB = await User.findOne({
    where: { username },
    include: [{ model: Item, include: [{ model: Image }] }],
    order: [[Item, "createdAt", "DESC"]],
  });
  return itemsFromDB.get({ plain: true }).items;
};

const createItem = async (_, { input: { content, images } }, context) => {
  const { id } = await authCheck(context);
  if (content.trim() === "" || Object.values(images).length < 1)
    throw new Error("Content or Images is Required");
  const transaction = await db.sequelize.transaction();
  try {
    const newItem = await Item.create(
      {
        content,
        user_id: id,
      },
      { transaction }
    );

    const image = JSON.parse(JSON.stringify(images));
    image.forEach((data) => {
      data["item_id"] = newItem.dataValues.id;
    });

    const savedImage = await Image.bulkCreate(image, { transaction }).then(
      (data) => {
        return JSON.parse(JSON.stringify(data));
      }
    );

    context.pubsub.publish(CREATED_ITEM, {
      createdItem: { ...newItem.dataValues, images: savedImage },
    });

    await transaction.commit();

    return {
      ...newItem.dataValues,
      images: savedImage,
    };
  } catch (e) {
    console.log(e);
    await transaction.rollback();
  }
};

const updateItem = async (_, { id, content }, context) => {
  const { id: user_id } = authCheck(context);
  const transaction = await db.sequelize.transaction();
  try {
    let ItemFromDB;
    if (content) {
      ItemFromDB = await Item.findOne({
        where: { id, user_id },
        include: [Image],
      })
        .then(async (data) => {
          const res = await data.update({ content });
          return JSON.parse(JSON.stringify(res));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    await transaction.commit();
    return {
      ...ItemFromDB,
    };
  } catch (e) {
    console.log(e);
    await transaction.rollback();
  }
};

const deleteImage = async (_, { name, item_id }, context) => {
  const { id: user_id } = authCheck(context);
  const item = await Item.findOne({
    where: { id: item_id, user_id },
    include: [Image],
  });
  const res = JSON.parse(JSON.stringify(item)).images.find(
    (e) => e.name == name
  );
  const transaction = await db.sequelize.transaction();
  try {
    let ItemFromDB;
    if (name && res) {
      ItemFromDB = await Image.findOne({ where: { name } })
        .then(async (data) => {
          const res = await data.destroy();
          return JSON.parse(JSON.stringify(res));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    await transaction.commit();
    return {
      ...ItemFromDB,
    };
  } catch (e) {
    await transaction.rollback();
  }
};

const deleteItem = (_, { id }, context) => {
  const { id: user_id } = authCheck(context);
  return Item.findOne({ where: { id, user_id }, include: [Image] })
    .then(async (data) => {
      const res = await data.destroy();
      data = JSON.parse(JSON.stringify(data));
      context.pubsub.publish(DELETED_ITEM, { deletedItem: { ...data } });
      return data;
    })
    .catch((err) => {
      return "Server is Error";
    });
};

module.exports = {
  Query: {
    getItems,
  },
  Mutation: {
    createItem,
    deleteItem,
    deleteImage,
    updateItem,
  },
  Subscription: {
    createdItem: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator([CREATED_ITEM]),
    },
    deletedItem: {
      subscribe: (parent, args, { pubsub }) =>
        pubsub.asyncIterator([DELETED_ITEM]),
    },
  },
};
