const { AuthenticationError } = require("apollo-server-express");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

exports.authCheck = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        if (jwt.verify(token, secretKey)) {
          return jwt.verify(token, secretKey);
        }
      } catch {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new AuthenticationError(
      "Authentication token must be Bearer [token]"
    );
  }
  throw new AuthenticationError("Authentication header must provided");
};
