const { Model, DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  class Product extends Model {}

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isAgeRestricted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Product",
      timestamps: true,
    }
  );

  Product.associate = (models) => {
    Product.hasMany(models.CartItem, { foreignKey: "product_id" });

    if (models.OrderItem) {
      Product.hasMany(models.OrderItem, { foreignKey: "product_id" });
    }
  };

  return Product;
};
