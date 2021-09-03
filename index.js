const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");

const { ApolloServer } = require("apollo-server-express");
const { fileLoader, mergeTypes, mergeResolvers } = require("merge-graphql-schemas");

require("dotenv").config();

// database
// require("./database/db");

// express
const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

// typedefs
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./typedefs")));

// resolvers
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, "./resolvers")));

// graphqlserver
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

// applyMiddleware connects Apolloserver to http framework
apolloServer.applyMiddleware({
  app,
});

// server
const httpserver = http.createServer(app);

// port
httpserver.listen(process.env.PORT, () => {
  console.log(`server is ready at ${process.env.PORT}`);
  console.log(`gql server is ready at ${process.env.PORT}${apolloServer.graphqlPath}`);
});
