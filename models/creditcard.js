"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CreditCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CreditCard.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });
    }
  }
  CreditCard.init(
    {
      CreditCard: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CreditCard",
    }
  );
  return CreditCard;
};
