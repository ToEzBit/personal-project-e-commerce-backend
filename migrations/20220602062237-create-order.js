"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
      },
      addressId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Address",
          },
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM([
          "neworder",
          "checkout",
          "payment",
          "pending",
          "delivered",
          "succeed",
          "canceled",
        ]),
        defaultValue: "neworder",
        allowNull: false,
      },
      totalPrice: {
        type: Sequelize.INTEGER,
      },
      slip: {
        type: Sequelize.STRING,
      },
      slipPublicId: {
        type: Sequelize.STRING,
      },
      trackingNumber: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      discount: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
