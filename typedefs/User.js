const { gql } = require("apollo-server-express");

module.exports = gql`
  type Role {
    id: Int
    name: String
  }

  type User {
    id: Int
    username: String
    password: String
    role_id: Int
    token: String
    role: Role
  }

  type Query {
    profile: User!
  }
  type Mutation {
    register(
      username: String!
      password: String!
      confirmPassword: String!
    ): User!
    login(username: String!, password: String!): User!
    logout: String
  }
`;
