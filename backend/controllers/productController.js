const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sequelize = require('../config/sequelize');
const ProductPostgres = require('../models/postgres/Product')(sequelize);
const ProductMongo = require('../models/mongo/ProductMongo');
const productSchema = require('../schemas/productSchema');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.getAllProducts = async (req, res) => {
  try {
    const products = await ProductMongo.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productMongo = await ProductMongo.findOne({ postgresId: req.params.id });

    if (!productMongo) {
      return res.status(404).json({ message: 'Product not found in MongoDB' });
    }

    res.json(productMongo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Créer un produit avec gestion d'image
exports.createProduct = async (req, res) => {
  try {
    console.log('Received product data:', req.body);

    req.body.price = parseFloat(req.body.price);
    req.body.stock = parseInt(req.body.stock, 10);

    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      console.log('Validation error:', validation.error.errors);
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, description, price, category, stock } = validation.data;
    const imagePath = req.file ? req.file.path : null;

    console.log('Creating product in PostgreSQL...');
    const newProductPostgres = await ProductPostgres.create({
      name,
      description,
      price,
      category,
      stock,
      imagePath
    });

    console.log('Creating product in MongoDB...');
    const newProductMongo = new ProductMongo({
      postgresId: newProductPostgres.id,
      name,
      description,
      price,
      category,
      stock,
      imagePath
    });

    await newProductMongo.save();
    console.log('Product created successfully in both databases');

    res.status(201).json(newProductPostgres);
  } catch (err) {
    console.error('Error during product creation:', err);
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un produit avec gestion d'image
exports.updateProduct = async (req, res) => {
  try {
    console.log('Received params ID:', req.params.id);

    req.body.price = parseFloat(req.body.price);
    req.body.stock = parseInt(req.body.stock, 10);

    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, description, price, category, stock } = validation.data;
    const newImagePath = req.file ? req.file.path : null;

    const productPostgres = await ProductPostgres.findByPk(req.params.id);
    if (!productPostgres) {
      return res.status(404).json({ message: 'Product not found in PostgreSQL' });
    }
    const productMongo = await ProductMongo.findOne({ postgresId: req.params.id });
    if (!productMongo) {
      return res.status(404).json({ message: 'Product not found in MongoDB' });
    }

    productPostgres.name = name;
    productPostgres.description = description;
    productPostgres.price = price;
    productPostgres.category = category;
    productPostgres.stock = stock;

    if (newImagePath) {
      productPostgres.imagePath = newImagePath;
    }

    await productPostgres.save();

    productMongo.name = name;
    productMongo.description = description;
    productMongo.price = price;
    productMongo.category = category;
    productMongo.stock = stock;

    if (newImagePath) {
      productMongo.imagePath = newImagePath;
    }

    await productMongo.save();

    res.json({
      postgresId: productPostgres.id,
      name: productPostgres.name,
      description: productPostgres.description,
      price: productPostgres.price,
      category: productPostgres.category,
      stock: productPostgres.stock,
      imagePath: productPostgres.imagePath
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const productPostgres = await ProductPostgres.findByPk(req.params.id);
    if (!productPostgres) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (productPostgres.imagePath) {
      const imagePath = path.join(__dirname, '..', productPostgres.imagePath);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression de l\'image:', err);
        } else {
          console.log('Image supprimée:', imagePath);
        }
      });
    }

    await productPostgres.destroy();

    await ProductMongo.findOneAndDelete({ postgresId: productPostgres.id });

    res.json({ message: 'Product and associated image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
