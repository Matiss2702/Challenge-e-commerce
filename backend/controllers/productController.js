const ProductPostgres = require('../models/postgres/Product');
const ProductMongo = require('../models/mongo/ProductMongo');
const productSchema = require('../schemas/productSchema');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await ProductMongo.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, description, price, category, brand, stock } = validation.data;
    const newProductPostgres = await ProductPostgres.create({
      name, description, price, category, brand, stock
    });

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

    productPostgres.name = name;
    productPostgres.description = description;
    productPostgres.price = price;
    productPostgres.category = category;
    productPostgres.brand = brand;
    productPostgres.stock = stock;
    await productPostgres.save();

    await ProductMongo.findOneAndUpdate(
      { postgresId: productPostgres.id },
      { name, description, price, category, brand, stock }
    );

    res.json(productPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productPostgres = await ProductPostgres.findByPk(req.params.id);
    if (!productPostgres) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await productPostgres.destroy();
    await ProductMongo.findOneAndDelete({ postgresId: productPostgres.id });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
