"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductComment.belongsTo(models.Product, {
        foreignKey: {
          name: "productId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      ProductComment.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });
    }
  }
  ProductComment.init(
    {
      userId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      rate: DataTypes.ENUM(["1", "2", "3", "4", "5"]),
    },
    {
      sequelize,
      modelName: "ProductComment",
    }
  );
  return ProductComment;
};
