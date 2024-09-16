const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Order extends Model {}

  Order.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    modelName: 'Order',
    timestamps: true,
  });

  return Order;
};
