const OrderPostgres = require('../models/postgres/Order');
const OrderMongo = require('../models/mongo/OrderMongo');
const orderSchema = require('../schemas/orderSchema');

// Get all orders (MongoDB)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrderMongo.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new order (PostgreSQL and synchronize with MongoDB)
exports.createOrder = async (req, res) => {
  try {
    const validation = orderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { user_id, total_amount, status, items } = validation.data;

    // Crée une nouvelle commande dans PostgreSQL
    const newOrderPostgres = await OrderPostgres.create({ user_id, total_amount, status });

    // Synchronisation avec MongoDB
    const newOrderMongo = new OrderMongo({
      postgresId: newOrderPostgres.id,
      user_id,
      total_amount,
      status,
      items,
    });
    await newOrderMongo.save();

    res.status(201).json(newOrderPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an order (PostgreSQL and MongoDB)
exports.updateOrder = async (req, res) => {
  try {
    const validation = orderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { user_id, total_amount, status, items } = validation.data;

    const orderPostgres = await OrderPostgres.findByPk(req.params.id);
    if (!orderPostgres) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Mise à jour de la commande dans PostgreSQL
    orderPostgres.user_id = user_id;
    orderPostgres.total_amount = total_amount;
    orderPostgres.status = status;
    await orderPostgres.save();

    // Synchronisation avec MongoDB
    await OrderMongo.findOneAndUpdate(
      { postgresId: orderPostgres.id },
      { user_id, total_amount, status, items }
    );

    res.json(orderPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an order (PostgreSQL and MongoDB)
exports.deleteOrder = async (req, res) => {
    try {
      const orderPostgres = await OrderPostgres.findByPk(req.params.id);
      if (!orderPostgres) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Suppression de la commande dans PostgreSQL
      await orderPostgres.destroy();
  
      // Suppression dans MongoDB
      await OrderMongo.findOneAndDelete({ postgresId: orderPostgres.id });
  
      res.json({ message: 'Order deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
