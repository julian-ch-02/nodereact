const { UserInputError } = require("apollo-server-errors");
const bcrypt = require("bcrypt");

const User = require("../database/models/user");
const Role = require("../database/models/role");
const { validateRegister, validateLogin } = require("../util/validator");
const { authCheck } = require("../util/authCheck");
const {
  generateToken,
  generateRefreshToken,
} = require("../util/generateToken");

require("dotenv").config();

const profile = async (_, args, context) => {
  const { username } = authCheck(context);
  const userFromDB = await User.findOne({
    raw: true,
    nest: true,
    where: { username },
    include: [Role],
  });

  return {
    ...userFromDB,
  };
};

const register = async (_, { username, password, confirmPassword }) => {
  const { errors, valid } = validateRegister(
    username,
    password,
    confirmPassword
  );

  if (!valid) {
    throw new UserInputError("Errors", { errors });
  }

  const user = await User.findOne({ where: { username } });

  if (user) {
    errors.username = "User is registered";
    return new UserInputError("Errors", { errors });
  }

  password = await bcrypt.hash(password, 12);

  const { id: role_id } = await Role.findOne({ where: { name: "user" } });

  const { dataValues } = await User.create({
    username,
    password,
    role_id,
  });

  const token = generateToken(dataValues);

  return {
    ...dataValues,
    token,
  };
};

const login = async (_, { username, password }, { res }) => {
  const { errors, valid } = validateLogin(username, password);
  if (!valid) {
    return new UserInputError("Error", { errors });
  }
  const user = await User.findOne({ raw: true, where: { username } });
  if (!user) {
    errors.username = "User not found";
    return new UserInputError("Error", { errors });
  }
  const validatedPassword = await bcrypt.compare(password, user.password);
  if (!validatedPassword) {
    errors.password = "Password invalid";
    return new UserInputError("Error", { errors });
  }
  res.cookie("jid", generateRefreshToken(user), { httpOnly: true });
  const token = generateToken(user);
  return {
    ...user,
    token,
  };
};

const logout = async (_, args, { res }) => {
  res.cookie("jid", "", {
    httpOnly: true,
  });
  return true;
};

module.exports = {
  Query: {
    profile,
  },
  Mutation: {
    register,
    login,
    logout,
  },
};
