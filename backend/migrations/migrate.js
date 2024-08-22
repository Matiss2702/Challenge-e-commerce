const mongoose = require('mongoose');
const { sequelize } = require('../models/postgres');

const runPostgresMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    await sequelize.sync({ alter: true });
    console.log('PostgreSQL schema synced');
  } catch (err) {
    console.error('Error syncing PostgreSQL database:', err.message);
    throw err;
  } finally {
    try {
      await sequelize.close();
      console.log('PostgreSQL connection closed');
    } catch (closeErr) {
      console.error('Error closing PostgreSQL connection:', closeErr.message);
    }
  }
};

const runMongoMigrations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    const models = require('../models/mongo');
    for (const modelName in models) {
      if (models[modelName].ensureIndexes) {
        await models[modelName].ensureIndexes();
        console.log(`Indexes ensured for MongoDB model: ${modelName}`);
      }
    }

    console.log('MongoDB migration completed');
  } catch (err) {
    console.error('Error syncing MongoDB database:', err.message);
    throw err;
  } finally {
    try {
      await mongoose.disconnect();
      console.log('MongoDB connection closed');
    } catch (closeErr) {
      console.error('Error closing MongoDB connection:', closeErr.message);
    }
  }
};

const runMigrations = async () => {
  console.log('Starting migrations...');

  try {
    await runPostgresMigrations();
    await runMongoMigrations();
    console.log('All migrations completed successfully');
  } catch (err) {
    console.error('Migration process encountered an error:', err.message);
  }
};

runMigrations();
