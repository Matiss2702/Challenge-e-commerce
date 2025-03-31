const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const { sequelize } = require("../models/postgres");
const fs = require("fs");
const path = require("path");

const loadMongoModels = () => {
  const mongoModels = {};
  const mongoModelsPath = path.join(__dirname, "../models/mongo");
  fs.readdirSync(mongoModelsPath).forEach((file) => {
    if (file.endsWith(".js")) {
      const model = require(path.join(mongoModelsPath, file));
      const modelName = path.basename(file, ".js");
      mongoModels[modelName] = model;
    }
  });
  return mongoModels;
};

const loadPostgresModels = (sequelize) => {
  const postgresModels = {};
  const postgresModelsPath = path.join(__dirname, "../models/postgres");

  fs.readdirSync(postgresModelsPath).forEach((file) => {
    if (file.endsWith(".js") && file !== "index.js") {
      const modelFile = require(path.join(postgresModelsPath, file));

      if (typeof modelFile === "function") {
        const modelName = path.basename(file, ".js");
        postgresModels[modelName] = modelFile(sequelize);
      } else {
        console.error(`Le fichier ${file} n'exporte pas une fonction de modèle Sequelize.`);
      }
    }
  });

  return postgresModels;
};

const mapProductData = (mongoProduct) => ({
  id: mongoProduct.postgresId,
  name: mongoProduct.name,
  description: mongoProduct.description,
  price: mongoProduct.price,
  category: mongoProduct.category,
  stock: mongoProduct.stock,
  imagePath: mongoProduct.imagePath,
  isAgeRestricted: mongoProduct.isAgeRestricted,
});

const mapOrderData = (mongoOrder) => ({
  id: mongoOrder.postgresId,
  orderNumber: mongoOrder.orderNumber,
  userId: mongoOrder.userId,
  totalPrice: mongoOrder.totalPrice,
  status: mongoOrder.status,
  createdAt: mongoOrder.createdAt,
});

const mapUserData = (mongoUser) => ({
  id: mongoUser.postgresId,
  email: mongoUser.email,
  password: mongoUser.password,
  name: mongoUser.name || "default_name",
  birthdate: mongoUser.birthdate || new Date(),
  role: mongoUser.role,
});

const mapPaymentData = (mongoPayment) => ({
  id: mongoPayment.postgresId,
  paymentMethod: mongoPayment.paymentMethod,
  amount: mongoPayment.amount,
  status: mongoPayment.status,
  userId: mongoPayment.userId,
  createdAt: mongoPayment.createdAt,
});

const mapShippingDetailData = (mongoShippingDetail) => ({
  id: mongoShippingDetail.postgresId,
  address: mongoShippingDetail.address,
  city: mongoShippingDetail.city,
  postalCode: mongoShippingDetail.postalCode,
  country: mongoShippingDetail.country,
  userId: mongoShippingDetail.userId,
  createdAt: mongoShippingDetail.createdAt,
});

const mappingFunctions = {
  Product: mapProductData,
  Order: mapOrderData,
  User: mapUserData,
  Payment: mapPaymentData,
  ShippingDetail: mapShippingDetailData,
};

const mongoModels = loadMongoModels();
const postgresModels = loadPostgresModels(sequelize);

const migrateCollection = async (mongoModel, postgresModel, mapDataFn) => {
  try {
    const mongoData = await mongoModel.find();

    for (const document of mongoData) {
      const postgresData = mapDataFn(document);

      await postgresModel.create(postgresData);
      console.log(`Migrated document with ID ${document._id} to PostgreSQL`);
    }
  } catch (err) {
    console.error(`Error migrating collection ${mongoModel.modelName}:`, err);
  }
};

const migrateData = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI;
    if (!mongoUrl) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    await sequelize.authenticate();
    console.log("PostgreSQL connected");

    await sequelize.sync({ force: true });
    console.log("Tables PostgreSQL synchronisées");

    for (const [modelName, mongoModel] of Object.entries(mongoModels)) {
      const postgresModelName = modelName.replace("Mongo", "");
      const postgresModel = postgresModels[postgresModelName];

      if (!postgresModel) {
        console.log(`Aucun modèle PostgreSQL correspondant pour le modèle MongoDB : ${modelName}`);
        continue;
      }

      const mapFunction = mappingFunctions[postgresModelName];
      if (mapFunction) {
        await migrateCollection(mongoModel, postgresModel, mapFunction);
      } else {
        console.error(`Aucune fonction de mapping définie pour le modèle : ${postgresModelName}`);
      }
    }

    console.log("Toutes les collections ont été migrées vers PostgreSQL avec succès");
  } catch (err) {
    console.error("Erreur lors de la migration des données :", err.message);
  } finally {
    try {
      await mongoose.disconnect();
      await sequelize.close();
      console.log("Connexions à MongoDB et PostgreSQL fermées");
    } catch (closeErr) {
      console.error("Erreur lors de la fermeture des connexions :", closeErr.message);
    }
  }
};

migrateData();
