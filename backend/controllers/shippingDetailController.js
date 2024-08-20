const ShippingDetailPostgres = require('../models/postgres/ShippingDetail');
const ShippingDetailMongo = require('../models/mongo/ShippingDetailMongo');
const shippingDetailSchema = require('../schemas/shippingDetailSchema');

// Get all shipping details (MongoDB)
exports.getAllShippingDetails = async (req, res) => {
  try {
    const shippingDetails = await ShippingDetailMongo.find();
    res.json(shippingDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new shipping detail (PostgreSQL and synchronize with MongoDB)
exports.createShippingDetail = async (req, res) => {
  try {
    const validation = shippingDetailSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { order_id, address, city, postal_code, country, shipping_method } = validation.data;

    // Crée un nouveau détail d'expédition dans PostgreSQL
    const newShippingDetailPostgres = await ShippingDetailPostgres.create({ order_id, address, city, postal_code, country, shipping_method });

    // Synchronisation avec MongoDB
    const newShippingDetailMongo = new ShippingDetailMongo({
      postgresId: newShippingDetailPostgres.id,
      order_id,
      address,
      city,
      postal_code,
      country,
      shipping_method,
    });
    await newShippingDetailMongo.save();

    res.status(201).json(newShippingDetailPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a shipping detail (PostgreSQL and MongoDB)
exports.updateShippingDetail = async (req, res) => {
  try {
    const validation = shippingDetailSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { order_id, address, city, postal_code, country, shipping_method } = validation.data;

    const shippingDetailPostgres = await ShippingDetailPostgres.findByPk(req.params.id);
    if (!shippingDetailPostgres) {
      return res.status(404).json({ message: 'Shipping detail not found' });
    }

    // Mise à jour du détail d'expédition dans PostgreSQL
    shippingDetailPostgres.order_id = order_id;
    shippingDetailPostgres.address = address;
    shippingDetailPostgres.city = city;
    shippingDetailPostgres.postal_code = postal_code;
    shippingDetailPostgres.country = country;
    shippingDetailPostgres.shipping_method = shipping_method;
    await shippingDetailPostgres.save();

    // Synchronisation avec MongoDB
    await ShippingDetailMongo.findOneAndUpdate(
      { postgresId: shippingDetailPostgres.id },
      { order_id, address, city, postal_code, country, shipping_method }
    );

    res.json(shippingDetailPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a shipping detail (PostgreSQL and MongoDB)
exports.deleteShippingDetail = async (req, res) => {
  try {
    const shippingDetailPostgres = await ShippingDetailPostgres.findByPk(req.params.id);
    if (!shippingDetailPostgres) {
      return res.status(404).json({ message: 'Shipping detail not found' });
    }

    // Suppression du détail d'expédition dans PostgreSQL
    await shippingDetailPostgres.destroy();

    // Suppression dans MongoDB
    await ShippingDetailMongo.findOneAndDelete({ postgresId: shippingDetailPostgres.id });

    res.json({ message: 'Shipping detail deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
