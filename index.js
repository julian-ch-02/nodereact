const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { ApolloServer, PubSub } = require("apollo-server-express");
const {
  fileLoader,
  mergeTypes,
  mergeResolvers,
} = require("merge-graphql-schemas");

require("dotenv").config();

const User = require("./database/models/user");
const { Upload, Delete } = require("./image/controller");
const { multerUpload } = require("./config/imageUploader");
const { generateToken, generateRefreshToken } = require("./util/generateToken");
const { authCheck } = require("./util/authCheck");

const pubsub = new PubSub();

// express
const app = express();

// database
require("./database/models/index");

// middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: "https://keepdata.herokuapp.com",
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "5mb" }));

// typedefs
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./typedefs")));

// resolvers
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

// graphqlserver
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res, payload }) => ({ req, res, payload, pubsub }),
});

// applyMiddleware connects Apolloserver to http framework
apolloServer.applyMiddleware({
  app,
  cors: false,
});

// server
const httpserver = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpserver);

// route
app.post("/upload", multerUpload.array("images"), (req, res) =>
  Upload(req, res)
);
app.post("/delete", (req, res) => Delete(req, res));
app.post("/refresh_token", async (req, res) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: "" });
  }

  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_KEY);
  } catch (e) {
    console.log(e);
    return res.send({ ok: false, accessToken: "" });
  }

  const user = await User.findOne({ id: payload.userId });

  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }

  res.cookie("jid", generateRefreshToken(user), { httpOnly: true });

  return res.send({
    ok: true,
    username: user.username,
    token: generateToken(user),
  });
});

// port
httpserver.listen(process.env.PORT, () => {
  console.log(`server is ready at ${process.env.PORT}`);
  console.log(
    `gql server is ready at ${process.env.PORT}${apolloServer.graphqlPath}`
  );
  console.log(
    `subscription server is ready at ${process.env.PORT}${apolloServer.subscriptionsPath}`
  );
});
