const { Model, DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  class Payment extends Model {}

  Payment.init(
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
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "EUR",
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_method_types: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      stripe_payment_intent_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      stripe_checkout_session_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      receipt_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Payment",
      timestamps: true,
    }
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, { foreignKey: "order_id" });
  };

  return Payment;
};
