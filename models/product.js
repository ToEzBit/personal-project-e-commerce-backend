"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.ProductImage, {
        foreignKey: {
          name: "productId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Product.hasMany(models.ProductComment, {
        foreignKey: {
          name: "productId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Product.hasMany(models.OrderProduct, {
        foreignKey: {
          name: "productId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });
    }
  }
  Product.init(
    {
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM(["standard", "limited", "event"]),
        defaultValue: "standard",
      },
      category: {
        type: DataTypes.ENUM(["sd", "hg", "rg", "mg", "pg", "mega"]),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mainDescription: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      subDescription1: DataTypes.STRING(500),
      subDescription2: DataTypes.STRING(500),
      status: {
        type: DataTypes.ENUM(["active", "inactive"]),
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
