import gql from "graphql-tag";

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      token
    }
  }
`;

export const REGISTER = gql`
  mutation register(
    $username: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      username
      token
    }
  }
`;

export const CREATE_ITEM = gql`
  mutation createItem($content: String!, $images: [ImageInput!]) {
    createItem(input: { content: $content, images: $images }) {
      id
      content
      images {
        name
      }
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation updateItem($id: Int!, $content: String!) {
    updateItem(id: $id, content: $content) {
      id
      content
      images {
        name
      }
    }
  }
`;

export const UPDATE_IMAGE = gql`
  mutation updateImage($id: Int!, $name: String!) {
    updateImage(id: $id, name: $name) {
      name
    }
  }
`;

export const DELETE_ITEM = gql`
  mutation deletedItem($id: Int!) {
    deleteItem(id: $id) {
      images {
        name
      }
    }
  }
`;

export const DELETE_IMAGE = gql`
  mutation deleteImage($name: String!, $item_id: Int!) {
    deleteImage(name: $name, item_id: $item_id) {
      name
    }
  }
`;

export const LOGOUT = gql`
  mutation logout {
    logout
  }
`;
