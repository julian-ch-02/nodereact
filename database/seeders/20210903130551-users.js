"use strict";
const bcrypt = require("bcrypt");

const hashPassword = (pass) => {
  return bcrypt.hashSync(pass, bcrypt.genSaltSync(8));
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("users", [
      {
        username: "superadmin",
        password: hashPassword("admin2121"),
        role_id : 5,
      },{
        username: "user",
        password: hashPassword("user123"),
        role_id : 6,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", null, {});
  },
};
