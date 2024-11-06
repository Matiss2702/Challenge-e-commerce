const mongoose = require('mongoose');
const { sequelize } = require('../models/postgres');
const fs = require('fs');
const path = require('path');

// Fonction pour charger dynamiquement tous les modèles MongoDB
const loadMongoModels = () => {
  const mongoModels = {};
  const mongoModelsPath = path.join(__dirname, '../models/mongo');
  fs.readdirSync(mongoModelsPath).forEach(file => {
    if (file.endsWith('.js')) {
      const model = require(path.join(mongoModelsPath, file));
      const modelName = path.basename(file, '.js');
      mongoModels[modelName] = model;
    }
  });
  return mongoModels;
};

// Fonction pour charger dynamiquement tous les modèles PostgreSQL
const loadPostgresModels = (sequelize) => {
  const postgresModels = {};
  const postgresModelsPath = path.join(__dirname, '../models/postgres');

  fs.readdirSync(postgresModelsPath).forEach(file => {
    if (file.endsWith('.js') && file !== 'index.js') {
      const modelFile = require(path.join(postgresModelsPath, file));

      if (typeof modelFile === 'function') {
        const modelName = path.basename(file, '.js');
        postgresModels[modelName] = modelFile(sequelize);
      } else {
        console.error(`Le fichier ${file} n'exporte pas une fonction de modèle Sequelize.`);
      }
    }
  });

  return postgresModels;
};

// Fonctions de mapping pour chaque modèle
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
  name: mongoUser.name || 'default_name',
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

// Mapping des fonctions de transformation de données
const mappingFunctions = {
  Product: mapProductData,
  Order: mapOrderData,
  User: mapUserData,
  Payment: mapPaymentData,
  ShippingDetail: mapShippingDetailData,
};

// Initialisation des modèles MongoDB et PostgreSQL
const mongoModels = loadMongoModels();
const postgresModels = loadPostgresModels(sequelize);

// Fonction de migration générique pour chaque collection
const migrateCollection = async (mongoModel, postgresModel, mapDataFn) => {
  try {
    const mongoData = await mongoModel.find();

    for (const document of mongoData) {
      // Mapper les données de MongoDB vers PostgreSQL
      const postgresData = mapDataFn(document);

      // Insérer dans PostgreSQL
      await postgresModel.create(postgresData);
      console.log(`Migrated document with ID ${document._id} to PostgreSQL`);
    }
  } catch (err) {
    console.error(`Error migrating collection ${mongoModel.modelName}:`, err);
  }
};

// Script de migration global
const migrateData = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Connexion à PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    // Synchroniser les modèles Sequelize pour créer les tables si elles n'existent pas
    await sequelize.sync({ force: true });
    console.log('Tables PostgreSQL synchronisées');

    // Boucler sur tous les modèles MongoDB pour les migrer vers PostgreSQL
    for (const [modelName, mongoModel] of Object.entries(mongoModels)) {
      const postgresModelName = modelName.replace('Mongo', '');
      const postgresModel = postgresModels[postgresModelName];

      if (!postgresModel) {
        console.log(`Aucun modèle PostgreSQL correspondant pour le modèle MongoDB : ${modelName}`);
        continue;
      }

      // Trouver la fonction de mapping correspondante
      const mapFunction = mappingFunctions[postgresModelName];
      if (mapFunction) {
        await migrateCollection(mongoModel, postgresModel, mapFunction);
      } else {
        console.error(`Aucune fonction de mapping définie pour le modèle : ${postgresModelName}`);
      }
    }

    console.log('Toutes les collections ont été migrées vers PostgreSQL avec succès');
  } catch (err) {
    console.error('Erreur lors de la migration des données :', err.message);
  } finally {
    // Fermer les connexions
    await mongoose.disconnect();
    await sequelize.close();
    console.log('Connexions à MongoDB et PostgreSQL fermées');
  }
};

migrateData();
