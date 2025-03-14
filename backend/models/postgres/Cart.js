const { Model, DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  class Cart extends Model {}

  Cart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Cart",
      timestamps: true,
      tableName: "Carts",
    }
  );

  Cart.associate = (models) => {
    Cart.hasMany(models.CartItem, { foreignKey: "cart_id" });
  };

  return Cart;
};
