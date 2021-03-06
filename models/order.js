"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Order.belongsTo(models.Address, {
        foreignKey: {
          name: "addressId",
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Order.hasMany(models.OrderProduct, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });
    }
  }
  Order.init(
    {
      status: {
        type: DataTypes.ENUM([
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
        type: DataTypes.INTEGER,
      },
      slip: DataTypes.STRING,
      slipPublicId: DataTypes.STRING,
      trackingNumber: DataTypes.STRING,
      discount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
