const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sequelize = require("../config/sequelize");
const ProductPostgres = require("../models/postgres/Product")(sequelize);
const ProductMongo = require("../models/mongo/ProductMongo");
const productSchema = require("../schemas/productSchema");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

exports.getSimilarProducts = async (req, res) => {
  try {
    const { category, productId } = req.query;
    const products = await ProductMongo.find({
      category,
      postgresId: { $ne: productId },
    });
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la recherche des produits similaires.",
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { category, maxPrice, alcohol, inStock, searchTerm } = req.query;
    let filter = {};

    if (category) {
      const categoriesArray = Array.isArray(category) ? category : category.split(",");
      filter.category = {
        $all: categoriesArray.map((cat) => new RegExp(cat.trim(), "i")),
      };
    }

    if (maxPrice) {
      filter.price = { $lte: parseFloat(maxPrice) };
    }

    if (alcohol) {
      if (alcohol === "with") {
        filter.isAgeRestricted = true;
      } else if (alcohol === "without") {
        filter.isAgeRestricted = false;
      }
    }

    // Filtrer par stock
    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    if (searchTerm) {
      filter.name = { $regex: searchTerm, $options: "i" };
    }

    const products = await ProductMongo.find(filter);
    const isLoggedIn = !!req.headers.authorization;

    const productsResponse = products.map((product) => ({
      postgresId: product.postgresId,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imagePath: product.imagePath,
      isAgeRestricted: product.isAgeRestricted,
      ...(isLoggedIn ? { stock: product.stock } : {}),
    }));

    res.json(productsResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const products = await ProductMongo.find();
    const categories = new Set();

    products.forEach((product) => {
      product.category.split(",").forEach((cat) => categories.add(cat.trim()));
    });

    res.json([...categories]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productMongo = await ProductMongo.findOne({
      postgresId: req.params.id,
    });

    if (!productMongo) {
      return res.status(404).json({ message: "Produit non trouvé dans MongoDB" });
    }

    const isLoggedIn = !!req.headers.authorization;
    const productResponse = {
      postgresId: productMongo.postgresId,
      name: productMongo.name,
      description: productMongo.description,
      price: productMongo.price,
      category: productMongo.category,
      imagePath: productMongo.imagePath,
      isAgeRestricted: productMongo.isAgeRestricted,
      ...(isLoggedIn ? { stock: productMongo.stock } : {}),
    };

    res.json(productResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    console.log("Received product data:", req.body);

    req.body.price = parseFloat(req.body.price);
    req.body.stock = parseInt(req.body.stock, 10);
    req.body.isAgeRestricted = req.body.isAgeRestricted === "true";

    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      console.log("Validation error:", validation.error.errors);
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, description, price, category, stock, isAgeRestricted } = validation.data;
    const imagePath = req.file ? req.file.path : null;

    console.log("Creating product in PostgreSQL...");
    const newProductPostgres = await ProductPostgres.create({
      name,
      description,
      price,
      category,
      stock,
      imagePath,
      isAgeRestricted,
    });

    console.log("Creating product in MongoDB...");
    const newProductMongo = new ProductMongo({
      postgresId: newProductPostgres.id,
      name,
      description,
      price,
      category,
      stock,
      imagePath,
      isAgeRestricted,
    });

    await newProductMongo.save();

    res.status(201).json(newProductPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const userRole = req.user.role;

    const productMongo = await ProductMongo.findOne({ postgresId: req.params.id });
    if (!productMongo) {
      return res.status(404).json({ message: "Product not found in MongoDB" });
    }

    const productPostgres = await ProductPostgres.findByPk(productMongo.postgresId);
    if (!productPostgres) {
      return res.status(404).json({ message: "Product not found in PostgreSQL" });
    }

    if (userRole === "ROLE_MAGAZINIER") {
      const newStock = parseInt(req.body.stock, 10);
      if (isNaN(newStock)) {
        return res.status(400).json({ message: "Valeur de stock invalide" });
      }
      productPostgres.stock = newStock;
      await productPostgres.save();

      productMongo.stock = newStock;
      await productMongo.save();

      return res.json({ postgresId: productPostgres.id, stock: productPostgres.stock });
    }

    req.body.price = parseFloat(req.body.price);
    req.body.stock = parseInt(req.body.stock, 10);
    req.body.isAgeRestricted = req.body.isAgeRestricted === "true";

    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }
    const { name, description, price, category, stock, isAgeRestricted } = validation.data;
    const newImagePath = req.file ? req.file.path : null;

    productPostgres.name = name;
    productPostgres.description = description;
    productPostgres.price = price;
    productPostgres.category = category;
    productPostgres.stock = stock;
    productPostgres.isAgeRestricted = isAgeRestricted;
    if (newImagePath) {
      productPostgres.imagePath = newImagePath;
    }
    await productPostgres.save();

    productMongo.name = name;
    productMongo.description = description;
    productMongo.price = price;
    productMongo.category = category;
    productMongo.stock = stock;
    productMongo.isAgeRestricted = isAgeRestricted;
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
      isAgeRestricted: productPostgres.isAgeRestricted,
      imagePath: productPostgres.imagePath,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productPostgres = await ProductPostgres.findByPk(req.params.id);
    if (!productPostgres) {
      return res.status(404).json({ message: "Product not found in PostgreSQL" });
    }

    if (productPostgres.imagePath) {
      const imagePath = path.join(__dirname, "..", productPostgres.imagePath);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression de l'image:", err);
        } else {
          console.log("Image supprimée:", imagePath);
        }
      });
    }

    await productPostgres.destroy();

    await ProductMongo.findOneAndDelete({ postgresId: productPostgres.id });

    res.json({ message: "Product and associated image deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
