"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderProduct.belongsTo(models.Order, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      OrderProduct.belongsTo(models.Product, {
        foreignKey: {
          name: "productId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });
    }
  }
  OrderProduct.init(
    {
      amount: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderProduct",
    }
  );
  return OrderProduct;
};
