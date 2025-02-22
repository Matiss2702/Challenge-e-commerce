const { Model, DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  class ShippingDetail extends Model {}

  ShippingDetail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Orders",
          key: "id",
        },
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shipping_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ShippingDetail",
      timestamps: true,
    }
  );

  ShippingDetail.associate = (models) => {
    ShippingDetail.belongsTo(models.Order, { foreignKey: "order_id" });
  };

  return ShippingDetail;
};
