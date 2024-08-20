const ProductPostgres = require('../models/postgres/Product');
const ProductMongo = require('../models/mongo/ProductMongo');
const productSchema = require('../schemas/productSchema');

// Get all products (MongoDB)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await ProductMongo.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new product (PostgreSQL and synchronize with MongoDB)
exports.createProduct = async (req, res) => {
  try {
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, description, price, category, brand, stock } = validation.data;

    // Création du produit dans PostgreSQL
    const newProductPostgres = await ProductPostgres.create({
      name, description, price, category, brand, stock
    });

    // Synchronisation avec MongoDB
    const newProductMongo = new ProductMongo({
      postgresId: newProductPostgres.id,
      name, description, price, category, brand, stock
    });
    await newProductMongo.save();

    res.status(201).json(newProductPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product (PostgreSQL and MongoDB)
exports.updateProduct = async (req, res) => {
  try {
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, description, price, category, brand, stock } = validation.data;

    const productPostgres = await ProductPostgres.findByPk(req.params.id);
    if (!productPostgres) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Mise à jour du produit dans PostgreSQL
    productPostgres.name = name;
    productPostgres.description = description;
    productPostgres.price = price;
    productPostgres.category = category;
    productPostgres.brand = brand;
    productPostgres.stock = stock;
    await productPostgres.save();

    // Synchronisation avec MongoDB
    await ProductMongo.findOneAndUpdate(
      { postgresId: productPostgres.id },
      { name, description, price, category, brand, stock }
    );

    res.json(productPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product (PostgreSQL and MongoDB)
exports.deleteProduct = async (req, res) => {
  try {
    const productPostgres = await ProductPostgres.findByPk(req.params.id);
    if (!productPostgres) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Suppression du produit dans PostgreSQL
    await productPostgres.destroy();

    // Suppression dans MongoDB
    await ProductMongo.findOneAndDelete({ postgresId: productPostgres.id });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
