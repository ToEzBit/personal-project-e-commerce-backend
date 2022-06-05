"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: Sequelize.ENUM(["standard", "limited", "event"]),
        defaultValue: "standard",
      },
      category: {
        type: Sequelize.ENUM(["sd", "hg", "rg", "mg", "pg", "mega"]),
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mainDescription: {
        type: Sequelize.STRING(500),
      },
      subDescription1: {
        type: Sequelize.STRING(500),
      },
      subDescription2: {
        type: Sequelize.STRING(500),
      },
      status: {
        type: Sequelize.ENUM(["active", "inactive"]),
        defaultValue: "active",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
