const OrderPostgres = require("../models/postgres/Order");
const { Product } = require("../models/postgres");

const OrderMongo = require("../models/mongo/OrderMongo");
const orderSchema = require("../schemas/orderSchema");

exports.getAllOrders = async (req, res) => {
  try {
    // On récupère toutes les commandes côté Mongo
    const orders = await OrderMongo.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrdersController = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await OrderMongo.find({ user_id: userId.toString() });

    const detailedOrders = [];

    for (const order of orders) {
      const newOrder = {
        ...order.toObject(),
        items: [],
      };

      for (const item of order.items) {
        const product = await Product.findByPk(item.product_id);

        let name = "Nom inconnu";
        let imagePath = null;
        if (product) {
          name = product.name;
          imagePath = product.imagePath;
        }

        newOrder.items.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          name,
          imagePath,
        });
      }

      detailedOrders.push(newOrder);
    }

    res.json(detailedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
exports.createOrder = async (req, res) => {
  try {
    const validation = orderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { user_id, total_amount, status, items } = validation.data;

    const newOrderPostgres = await OrderPostgres.create({
      user_id,
      total_amount,
      status,
    });

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

exports.updateOrder = async (req, res) => {
  try {
    const validation = orderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { user_id, total_amount, status, items } = validation.data;

    const orderPostgres = await OrderPostgres.findByPk(req.params.id);
    if (!orderPostgres) {
      return res.status(404).json({ message: "Order not found" });
    }

    orderPostgres.user_id = user_id;
    orderPostgres.total_amount = total_amount;
    orderPostgres.status = status;
    await orderPostgres.save();

    await OrderMongo.findOneAndUpdate({ postgresId: orderPostgres.id }, { user_id, total_amount, status, items });

    res.json(orderPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderPostgres = await OrderPostgres.findByPk(req.params.id);
    if (!orderPostgres) {
      return res.status(404).json({ message: "Order not found" });
    }

    await orderPostgres.destroy();
    await OrderMongo.findOneAndDelete({ postgresId: orderPostgres.id });

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
