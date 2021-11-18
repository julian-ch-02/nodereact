const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;
const refreshKey = process.env.REFRESH_KEY;

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    secretKey,
    { expiresIn: "15m" }
  );
};
exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    refreshKey,
    { expiresIn: "1h" }
  );
};
