"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        email: "john@email.com",
        userName: "john",
        password: "123456",
        firstName: "john",
        lastName: "Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "jane@email.com",
        userName: "jane",
        password: "123456",
        firstName: "jane",
        lastName: "Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "jack@email.com",
        userName: "jack",
        password: "123456",
        firstName: "jack",
        lastName: "Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "joe@email.com",
        userName: "joe",
        password: "123456",
        firstName: "joe",
        lastName: "Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
