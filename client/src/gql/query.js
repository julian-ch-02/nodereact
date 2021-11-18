import gql from "graphql-tag";

export const GET_ITEM = gql`
  query getItems {
    getItems {
      id
      content
      images {
        name
      }
    }
  }
`;
