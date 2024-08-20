const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');
const Order = require('./Order');

const ShippingDetail = sequelize.define('ShippingDetail', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Order,
      key: 'id',
    },
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
}, {
  timestamps: true,
});

module.exports = ShippingDetail;
