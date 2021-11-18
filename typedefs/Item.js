const { gql } = require("apollo-server-express");

module.exports = gql`
  type Image {
    name: String
  }
  type Item {
    id: Int
    content: String
    images: [Image]
  }
  input ImageInput {
    name: String
  }
  input ItemInput {
    content: String
    images: [ImageInput]
  }
  type Query {
    getItems: [Item]!
  }
  type Mutation {
    createItem(input: ItemInput!): Item!
    deleteItem(id: Int!): Item!
    updateItem(id: Int!, content: String!): Item!
    deleteImage(name: String!, item_id: Int!): Image
  }

  type Subscription {
    createdItem: Item
    updatedItem: Item
    deletedItem: Item
  }
`;
