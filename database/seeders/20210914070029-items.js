'use strict';

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
    await queryInterface.bulkInsert("items",[
      {
        content : "ABC",
        user_id : "15",
      },
      {
        content : "CDE",
        user_id : "15",
      },
      {
        content : "EFG",
        user_id : "15",
      },
      {
        content : "ABC",
        user_id : "16",
      },
      {
        content : "CDE",
        user_id : "16",
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
